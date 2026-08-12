/* ============================================================
   MedFind — Medicines listing page (search, filter, sort)
   ============================================================ */

import { initPage, toast, getQueryParam, escapeHtml, addToCart } from './app.js';
import {
  medicines,
  categories,
  searchMedicines,
  availabilityBadge,
  formatPrice
} from './medicines.js';
import { medCardHtml, attachCardEvents } from './home.js';

initPage('medicines');

const state = {
  query: getQueryParam('q') || '',
  category: getQueryParam('category') || '',
  minPrice: '',
  maxPrice: '',
  availOnly: false,
  forms: new Set(),
  sort: 'default'
};

/* Init UI values */
document.getElementById('filterSearch').value = state.query;

/* Category checkboxes */
const catBox = document.getElementById('filterCategories');
catBox.innerHTML = categories
  .map(
    (c) =>
      `<label><input type="checkbox" value="${escapeHtml(c.name)}" ${state.category === c.name ? 'checked' : ''} /> ${escapeHtml(c.name)}</label>`
  )
  .join('');

/* Form checkboxes */
const forms = [...new Set(medicines.map((m) => m.form))];
document.getElementById('filterForms').innerHTML = forms
  .map((f) => `<label><input type="checkbox" value="${escapeHtml(f)}" /> ${escapeHtml(f)}</label>`)
  .join('');

/* If category from URL, pre-check */
if (state.category) {
  state.forms; /* no-op to keep state shape */
}

/* Events */
document.getElementById('filterSearch').addEventListener('input', (e) => {
  state.query = e.target.value;
  render();
});

catBox.addEventListener('change', (e) => {
  if (e.target.matches('input[type="checkbox"]')) {
    const boxes = catBox.querySelectorAll('input:checked');
    state.category = boxes.length ? boxes[0].value : '';
    catBox.querySelectorAll('input').forEach((b) => {
      if (b !== e.target) b.checked = false;
    });
    render();
  }
});

document.getElementById('minPrice').addEventListener('input', (e) => {
  state.minPrice = e.target.value;
  render();
});
document.getElementById('maxPrice').addEventListener('input', (e) => {
  state.maxPrice = e.target.value;
  render();
});
document.getElementById('availOnly').addEventListener('change', (e) => {
  state.availOnly = e.target.checked;
  render();
});
document.getElementById('filterForms').addEventListener('change', (e) => {
  if (e.target.matches('input[type="checkbox"]')) {
    if (e.target.checked) state.forms.add(e.target.value);
    else state.forms.delete(e.target.value);
    render();
  }
});
document.getElementById('sortBy').addEventListener('change', (e) => {
  state.sort = e.target.value;
  render();
});
document.getElementById('clearFilters').addEventListener('click', () => {
  state.query = '';
  state.category = '';
  state.minPrice = '';
  state.maxPrice = '';
  state.availOnly = false;
  state.forms.clear();
  state.sort = 'default';
  document.getElementById('filterSearch').value = '';
  document.getElementById('minPrice').value = '';
  document.getElementById('maxPrice').value = '';
  document.getElementById('availOnly').checked = false;
  document.getElementById('sortBy').value = 'default';
  catBox.querySelectorAll('input').forEach((b) => (b.checked = false));
  document.getElementById('filterForms').querySelectorAll('input').forEach((b) => (b.checked = false));
  render();
  toast('Filters cleared', '');
});

/* Render */
function render() {
  let list = searchMedicines(state.query);

  if (state.category) {
    list = list.filter((m) => m.category === state.category);
  }
  if (state.minPrice !== '') {
    list = list.filter((m) => m.price >= Number(state.minPrice));
  }
  if (state.maxPrice !== '') {
    list = list.filter((m) => m.price <= Number(state.maxPrice));
  }
  if (state.availOnly) {
    list = list.filter((m) => m.available);
  }
  if (state.forms.size) {
    list = list.filter((m) => state.forms.has(m.form));
  }

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
    case 'name':
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  const grid = document.getElementById('medicineResults');
  const empty = document.getElementById('medicineEmpty');
  const count = document.getElementById('resultCount');

  count.textContent = `${list.length} medicine${list.length === 1 ? '' : 's'}`;

  if (!list.length) {
    grid.innerHTML = '';
    grid.classList.add('hide');
    empty.classList.remove('hide');
    return;
  }
  grid.classList.remove('hide');
  empty.classList.add('hide');
  grid.innerHTML = list.map((m) => medCardHtml(m)).join('');
  attachCardEvents(grid);
}

render();

/* If no results from URL query, show toast */
if (state.query) {
  const list = searchMedicines(state.query);
  if (!list.length) toast('No medicine found', 'warn');
}
