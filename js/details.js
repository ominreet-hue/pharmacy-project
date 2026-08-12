/* ============================================================
   MedFind — Medicine details page
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
  availabilityBadge
} from './medicines.js';

initPage('medicines');

const id = Number(getQueryParam('id')) || 1;
const med = getMedicineById(id);

if (!med) {
  document.getElementById('detailsRoot').classList.add('hide');
  document.getElementById('detailsEmpty').classList.remove('hide');
} else {
  document.getElementById('crumbName').textContent = med.name;
  renderDetails();
}

function renderDetails() {
  const root = document.getElementById('detailsRoot');
  const alts = getAlternatives(med.id);
  const cheapest = getCheapestAlternative(med.id);

  const altRows = alts
    .map((a) => {
      const diff = priceDiff(med, a);
      const pct = pctDiff(med, a);
      const isBest = cheapest && a.id === cheapest.id;
      return `
      <tr class="${isBest ? 'best-row' : ''}">
        <td>${escapeHtml(a.name)}</td>
        <td class="num">${formatPrice(a.price)}</td>
        <td class="num" style="color:var(--success)">− ${formatPrice(diff)}</td>
        <td class="num">${pct}%</td>
        <td>${availabilityBadge(a)}</td>
        <td>${isBest ? '<span class="badge badge--accent">Best Price</span>' : ''}</td>
      </tr>`;
    })
    .join('');

  const altCards = alts
    .map(
      (a) => `
      <div class="med-card">
        <div class="med-card__top">
          <div class="med-card__icon">${a.icon || '💊'}</div>
          <div class="med-card__body">
            <div class="med-card__name">${escapeHtml(a.name)}</div>
            <div class="med-card__meta">${escapeHtml(a.activeIngredient)} &middot; ${a.dosage}</div>
          </div>
        </div>
        <div class="med-card__row">
          <span class="med-card__price">${formatPrice(a.price)}</span>
          ${availabilityBadge(a)}
        </div>
        <div class="med-card__actions">
          <a class="btn btn--secondary btn--sm" href="medicine-details.html?id=${a.id}">View Details</a>
          <button class="btn btn--primary btn--sm" type="button" data-add="${a.id}">Add to Cart</button>
        </div>
      </div>`
    )
    .join('');

  root.innerHTML = `
    <h1 class="section-title">Medicine Details</h1>

    <div class="detail-layout">
      <!-- Left card -->
      <aside class="detail-card">
        <div class="detail-card__icon">${med.icon || '💊'}</div>
        <div class="detail-card__name">${escapeHtml(med.name)}</div>
        <p class="text-muted">${escapeHtml(med.activeIngredient)}</p>
        <div class="detail-card__price">${formatPrice(med.price)}</div>
        <div class="mb-2">${availabilityBadge(med)}</div>
        <div class="flex gap-1" style="flex-direction:column">
          <button class="btn btn--primary btn--block" type="button" id="addMainToCart">Add to Cart</button>
          <a class="btn btn--outline btn--block" href="alternatives.html?id=${med.id}">View Alternatives</a>
        </div>
      </aside>

      <!-- Right info -->
      <div>
        <div class="card mb-3">
          <h3>Information</h3>
          <ul class="info-list">
            <li><span>Active Ingredient</span><span>${escapeHtml(med.activeIngredient)}</span></li>
            <li><span>Dosage</span><span>${med.dosage}</span></li>
            <li><span>Form</span><span>${med.form}</span></li>
            <li><span>Manufacturer</span><span>${escapeHtml(med.manufacturer)}</span></li>
            <li><span>Category</span><span>${escapeHtml(med.category)}</span></li>
            <li><span>Price</span><span>${formatPrice(med.price)}</span></li>
            <li><span>Availability</span><span>${med.available ? 'In stock' : 'Out of stock'}</span></li>
            <li><span>Alternatives</span><span>${alts.length}</span></li>
          </ul>
        </div>

        <div class="card mb-3">
          <h3 class="mb-2">Description</h3>
          <p class="text-muted">${escapeHtml(med.description)}</p>
          <h4 class="mt-3 mb-2" style="font-size:var(--fs-base)">General Usage</h4>
          <p class="text-muted">${escapeHtml(med.usage)}</p>
        </div>

        <div class="alert alert--warn mb-3">
          <span class="alert__icon">⚠</span>
          <span><strong>Medicine information is for guidance only.</strong> Always follow your doctor's or pharmacist's instructions. Do not substitute medicines without professional advice.</span>
        </div>

        ${
          alts.length
            ? `
        <section class="section">
          <h2>Price Comparison</h2>
          <p class="text-muted mb-2">Compare this medicine with available alternatives. The cheapest option is highlighted.</p>
          <div class="compare-grid mb-3">
            <div class="compare-tile compare-tile--orig">
              <div class="compare-tile__label">Original</div>
              <div class="compare-tile__name">${escapeHtml(med.name)}</div>
              <div class="compare-tile__price">${formatPrice(med.price)}</div>
            </div>
            ${cheapest ? `
            <div class="compare-tile compare-tile--best">
              <div class="compare-tile__label">Best Price</div>
              <div class="compare-tile__name">${escapeHtml(cheapest.name)}</div>
              <div class="compare-tile__price">${formatPrice(cheapest.price)}</div>
            </div>` : ''}
            ${cheapest ? `
            <div class="compare-tile" style="background:var(--secondary)">
              <div class="compare-tile__label">You Save</div>
              <div class="compare-tile__price" style="color:var(--success)">${formatPrice(priceDiff(med, cheapest))}</div>
            </div>` : ''}
          </div>

          <div class="table-wrap mb-3">
            <table class="table">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th class="num">Price</th>
                  <th class="num">Difference</th>
                  <th class="num">%</th>
                  <th>Availability</th>
                  <th>Label</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>${escapeHtml(med.name)}</strong> (Original)</td>
                  <td class="num">${formatPrice(med.price)}</td>
                  <td class="num">—</td>
                  <td class="num">—</td>
                  <td>${availabilityBadge(med)}</td>
                  <td></td>
                </tr>
                ${altRows}
              </tbody>
            </table>
          </div>

          ${cheapest ? `
          <div class="save-more mb-3">
            <h3>Save More</h3>
            <p>Lowest price option: <strong>${escapeHtml(cheapest.name)}</strong></p>
            <div class="save-more__amount">You save ${formatPrice(priceDiff(med, cheapest))} (${pctDiff(med, cheapest)}%)</div>
            <div class="flex gap-1 center">
              <button class="btn btn--secondary" type="button" id="chooseLower" data-add="${cheapest.id}">Choose Lower-Cost Option</button>
              <a class="btn btn--outline" href="alternatives.html?id=${med.id}" style="border-color:#fff;color:#fff">See All Alternatives</a>
            </div>
            <div class="save-more__note">Please confirm substitutions with your pharmacist or doctor.</div>
          </div>` : ''}

          <h3 class="mb-2">Alternative Medicines</h3>
          <div class="grid grid-auto">${altCards}</div>
        </section>`
            : `
        <div class="card text-center mt-3">
          <p class="text-muted">No alternatives are listed for this medicine.</p>
        </div>`
        }
      </div>
    </div>`;

  /* Events */
  document.getElementById('addMainToCart').addEventListener('click', () => addToCart(med.id));
  root.querySelectorAll('[data-add]').forEach((btn) => {
    btn.addEventListener('click', () => addToCart(Number(btn.dataset.add)));
  });
}
