/* ============================================================
   MedFind — Alternatives page (sort, filter, price diff)
   ============================================================ */

import {
  initPage,
  toast,
  escapeHtml,
  addToCart,
  getQueryParam
} from './app.js';
import {
  getMedicineById,
  getAlternatives,
  getCheapestAlternative,
  priceDiff,
  pctDiff,
  formatPrice,
  availabilityBadge,
  pharmacies
} from './medicines.js';

initPage('alternatives');

const id = Number(getQueryParam('id')) || 1;
const med = getMedicineById(id);

if (!med) {
  document.getElementById('altRoot').classList.add('hide');
  document.getElementById('altEmpty').classList.remove('hide');
} else {
  renderPage();
}

const state = { sort: 'price-asc', minPrice: '', maxPrice: '', availOnly: false, form: '' };

function renderPage() {
  const root = document.getElementById('altRoot');
  const alts = getAlternatives(med.id);

  const forms = [...new Set(alts.map((a) => a.form))];

  root.innerHTML = `
    <h1 class="section-title">${escapeHtml(med.name)} — Possible alternatives</h1>
    <p class="section-subtitle">Compare prices and availability. Confirm any substitution with your pharmacist.</p>

    <div class="card card--soft mb-3 flex between flex-wrap gap-2">
      <div>
        <strong>Original:</strong> ${escapeHtml(med.name)} &middot; ${formatPrice(med.price)}
        <div class="text-muted" style="font-size:var(--fs-sm)">${escapeHtml(med.activeIngredient)} &middot; ${med.dosage}</div>
      </div>
      <div>${availabilityBadge(med)}</div>
    </div>

    ${
      getCheapestAlternative(med.id)
        ? `
      <div class="save-more mb-3">
        <h3>Save More</h3>
        <p>Lowest price option: <strong>${escapeHtml(getCheapestAlternative(med.id).name)}</strong></p>
        <div class="save-more__amount">You save ${formatPrice(priceDiff(med, getCheapestAlternative(med.id)))} (${pctDiff(med, getCheapestAlternative(med.id))}%)</div>
        <div class="save-more__note">Please confirm substitutions with your pharmacist or doctor.</div>
      </div>`
        : ''
    }

    <div class="sort-bar">
      <label for="sortAlt">Sort by:</label>
      <select id="sortAlt">
        <option value="price-asc">Lowest Price</option>
        <option value="price-desc">Highest Price</option>
        <option value="avail">Available First</option>
      </select>
      <span style="margin-left:auto;display:flex;align-items:center;gap:0.5rem">
        <label for="altMin" class="text-muted">Min</label>
        <input class="field__input" type="number" id="altMin" placeholder="0" style="width:80px" />
        <label for="altMax" class="text-muted">Max</label>
        <input class="field__input" type="number" id="altMax" placeholder="∞" style="width:80px" />
      </span>
      <label><input type="checkbox" id="altAvailOnly" /> Available only</label>
      <select id="altForm" class="field__input" style="width:auto">
        <option value="">All forms</option>
        ${forms.map((f) => `<option value="${escapeHtml(f)}">${escapeHtml(f)}</option>`).join('')}
      </select>
    </div>

    <div id="altGrid" class="grid grid-auto"></div>
    <div id="altNoResults" class="empty hide">
      <div class="empty__icon">🔍</div>
      <div class="empty__title">No alternatives match your filters</div>
      <p class="empty__desc">Try adjusting the price range or clearing filters.</p>
    </div>
  `;

  /* Events */
  document.getElementById('sortAlt').addEventListener('change', (e) => {
    state.sort = e.target.value;
    renderAlts();
  });
  document.getElementById('altMin').addEventListener('input', (e) => {
    state.minPrice = e.target.value;
    renderAlts();
  });
  document.getElementById('altMax').addEventListener('input', (e) => {
    state.maxPrice = e.target.value;
    renderAlts();
  });
  document.getElementById('altAvailOnly').addEventListener('change', (e) => {
    state.availOnly = e.target.checked;
    renderAlts();
  });
  document.getElementById('altForm').addEventListener('change', (e) => {
    state.form = e.target.value;
    renderAlts();
  });

  renderAlts();
}

function renderAlts() {
  let list = getAlternatives(med.id);
  if (state.minPrice !== '') list = list.filter((a) => a.price >= Number(state.minPrice));
  if (state.maxPrice !== '') list = list.filter((a) => a.price <= Number(state.maxPrice));
  if (state.availOnly) list = list.filter((a) => a.available);
  if (state.form) list = list.filter((a) => a.form === state.form);

  switch (state.sort) {
    case 'price-asc':
      list = [...list].sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      list = [...list].sort((a, b) => b.price - a.price);
      break;
    case 'avail':
      list = [...list].sort((a, b) => Number(b.available) - Number(a.available));
      break;
  }

  const grid = document.getElementById('altGrid');
  const noRes = document.getElementById('altNoResults');

  if (!list.length) {
    grid.innerHTML = '';
    grid.classList.add('hide');
    noRes.classList.remove('hide');
    return;
  }
  grid.classList.remove('hide');
  noRes.classList.add('hide');

  const cheapest = getCheapestAlternative(med.id);
  const cheapestId = cheapest ? cheapest.id : -1;

  grid.innerHTML = list
    .map((a) => {
      const diff = priceDiff(med, a);
      const pct = pctDiff(med, a);
      const pharm = pharmacies[a.id % pharmacies.length];
      return `
      <article class="med-card">
        <div class="med-card__top">
          <div class="med-card__icon">${a.icon || '💊'}</div>
          <div class="med-card__body">
            <div class="med-card__name">${escapeHtml(a.name)}</div>
            <div class="med-card__meta">${escapeHtml(a.activeIngredient)} &middot; ${a.dosage} &middot; ${a.form}</div>
          </div>
        </div>
        <div class="med-card__row">
          <span class="med-card__price">${formatPrice(a.price)}</span>
          ${availabilityBadge(a)}
        </div>
        <div class="med-card__row">
          <span class="badge badge--ok">Save ${formatPrice(diff)} (${pct}%)</span>
          ${a.id === cheapestId ? '<span class="badge badge--accent">Best Price</span>' : ''}
        </div>
        <div class="med-card__meta text-muted">📍 ${escapeHtml(pharm.name)} &middot; ${pharm.distance} km</div>
        <div class="med-card__actions">
          <a class="btn btn--secondary btn--sm" href="medicine-details.html?id=${a.id}">View Details</a>
          <button class="btn btn--primary btn--sm" type="button" data-add="${a.id}">Add to Cart</button>
        </div>
      </article>`;
    })
    .join('');

  grid.querySelectorAll('[data-add]').forEach((btn) => {
    btn.addEventListener('click', () => addToCart(Number(btn.dataset.add)));
  });
}
