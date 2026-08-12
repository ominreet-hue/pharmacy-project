/* ============================================================
   MedFind — Home page logic
   ============================================================ */

import { initPage, toast, escapeHtml, addToCart } from './app.js';
import {
  categories,
  medicines,
  availabilityBadge,
  formatPrice,
  getByCategory
} from './medicines.js';

initPage('home');

/* Categories */
const catGrid = document.getElementById('categoryGrid');
catGrid.innerHTML = categories
  .map(
    (c) => {
      const count = getByCategory(c.name).length;
      return `
      <a class="cat-card" href="medicines.html?category=${encodeURIComponent(c.name)}" aria-label="Browse ${escapeHtml(c.name)}">
        <div class="cat-card__icon">${c.icon}</div>
        <div class="cat-card__label">${escapeHtml(c.name)}</div>
        <div class="cat-card__count">${count} medicines</div>
      </a>`;
    }
  )
  .join('');

/* Featured medicines (first 8) */
const featured = document.getElementById('featuredGrid');
featured.innerHTML = medicines
  .slice(0, 8)
  .map((m) => medCardHtml(m))
  .join('');

attachCardEvents(featured);

/* Search */
document.getElementById('heroSearchForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const q = document.getElementById('heroSearch').value.trim();
  if (!q) {
    toast('Please enter a medicine name', 'warn');
    return;
  }
  window.location.href = `medicines.html?q=${encodeURIComponent(q)}`;
});

/* Shared card template used by home + medicines pages */
export function medCardHtml(m) {
  const altCount = m.alternatives ? m.alternatives.length : 0;
  return `
  <article class="med-card">
    <div class="med-card__top">
      <div class="med-card__icon">${m.icon || '💊'}</div>
      <div class="med-card__body">
        <div class="med-card__name">${escapeHtml(m.name)}</div>
        <div class="med-card__meta">${escapeHtml(m.activeIngredient)} &middot; ${m.dosage}</div>
      </div>
    </div>
    <div class="med-card__row">
      <span class="med-card__price">${formatPrice(m.price)}</span>
      ${availabilityBadge(m)}
    </div>
    <div class="med-card__row">
      <span class="text-muted">${altCount} alternative${altCount === 1 ? '' : 's'}</span>
    </div>
    <div class="med-card__actions">
      <a class="btn btn--secondary btn--sm" href="medicine-details.html?id=${m.id}">View Details</a>
      <a class="btn btn--outline btn--sm" href="alternatives.html?id=${m.id}">Alternatives</a>
      <button class="btn btn--primary btn--sm" type="button" data-add="${m.id}">Add to Cart</button>
    </div>
  </article>`;
}

export function attachCardEvents(container) {
  if (!container) return;
  container.querySelectorAll('[data-add]').forEach((btn) => {
    btn.addEventListener('click', () => {
      addToCart(Number(btn.dataset.add));
    });
  });
}
