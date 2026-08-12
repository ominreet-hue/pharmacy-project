/* ============================================================
   MedFind — Prescription page logic
   ============================================================ */

import {
  toast,
  escapeHtml,
  savePrescription,
  getPrescription,
  clearPrescription,
  addToCart,
  setSelectedMedicine
} from './app.js';
import {
  medicines,
  getMedicineById,
  getCheapestAlternative,
  formatPrice,
  availabilityBadge
} from './medicines.js';

/* Simulated prescription recognition results */
const SAMPLE_PRESCRIPTION = [
  { id: 1, qty: 1 },
  { id: 7, qty: 1 },
  { id: 19, qty: 2 },
  { id: 22, qty: 1 }
];

export function initPrescriptionPage() {
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('prescriptionFile');
  const previewWrap = document.getElementById('previewWrap');
  const previewImg = document.getElementById('previewImg');
  const removeBtn = document.getElementById('removePreview');
  const analyzeBtn = document.getElementById('analyzeBtn');
  const resultsSection = document.getElementById('prescriptionResults');
  const emptyState = document.getElementById('prescriptionEmpty');

  if (!dropzone || !fileInput) return;

  /* Open file dialog when clicking the dropzone */
  dropzone.addEventListener('click', () => fileInput.click());

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) handleFile(e.target.files[0]);
  });

  removeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    clearPreview();
  });

  analyzeBtn.addEventListener('click', analyzePrescription);

  function handleFile(file) {
    if (!file.type.startsWith('image/')) {
      toast('Please upload an image file', 'err');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      previewImg.src = ev.target.result;
      previewWrap.classList.remove('hide');
      dropzone.classList.add('hide');
      analyzeBtn.disabled = false;
      toast('Prescription uploaded successfully', 'ok');
    };
    reader.readAsDataURL(file);
  }

  function clearPreview() {
    previewImg.src = '';
    previewWrap.classList.add('hide');
    dropzone.classList.remove('hide');
    analyzeBtn.disabled = true;
    fileInput.value = '';
  }

  function analyzePrescription() {
    if (!previewImg.src) {
      toast('Please upload a prescription first', 'warn');
      return;
    }
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = 'Analyzing...';
    toast('Analyzing your prescription...', '');

    setTimeout(() => {
      const results = SAMPLE_PRESCRIPTION.map((r) => {
        const med = getMedicineById(r.id);
        return { ...med, qty: r.qty };
      });
      savePrescription({ items: results, uploadedAt: Date.now() });
      renderResults(results);
      analyzeBtn.disabled = false;
      analyzeBtn.textContent = 'Analyze Prescription';
      toast('Prescription analyzed', 'ok');
    }, 1200);
  }

  /* Restore from storage if available */
  const saved = getPrescription();
  if (saved && saved.items && saved.items.length) {
    renderResults(saved.items);
  }
}

function renderResults(items) {
  const resultsSection = document.getElementById('prescriptionResults');
  const emptyState = document.getElementById('prescriptionEmpty');
  if (!resultsSection) return;

  if (emptyState) emptyState.classList.add('hide');
  resultsSection.classList.remove('hide');

  const originalTotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  let lowerTotal = 0;
  items.forEach((i) => {
    const cheapest = getCheapestAlternative(i.id);
    lowerTotal += (cheapest && cheapest.price < i.price ? cheapest.price : i.price) * i.qty;
  });
  const savings = originalTotal - lowerTotal;

  const itemsHtml = items
    .map(
      (med) => {
        const lineTotal = med.price * med.qty;
        return `
      <div class="pres-med" data-id="${med.id}">
        <div class="cart-item__icon">${med.icon || '💊'}</div>
        <div class="pres-med__body">
          <div class="pres-med__name">${escapeHtml(med.name)} &times; ${med.qty}</div>
          <div class="pres-med__meta">${escapeHtml(med.activeIngredient)} &middot; ${med.dosage} &middot; ${formatPrice(med.price)}</div>
        </div>
        <div>${availabilityBadge(med)}</div>
        <div class="cart-item__price">${formatPrice(lineTotal)}</div>
        <div class="pres-med__actions">
          <a class="btn btn--ghost btn--sm" href="medicine-details.html?id=${med.id}">View Details</a>
          <a class="btn btn--outline btn--sm" href="alternatives.html?id=${med.id}">Alternatives</a>
          <button class="btn btn--primary btn--sm" type="button" data-add="${med.id}">Add to Cart</button>
        </div>
      </div>`;
      }
    )
    .join('');

  resultsSection.innerHTML = `
    <div class="card mb-3">
      <h3 class="mb-2">Medicines found in your prescription</h3>
      <div class="grid gap-2">
        ${itemsHtml}
      </div>
    </div>

    <div class="card card--peach mb-3">
      <h3 class="mb-2">Compare Prescription Prices</h3>
      <div class="compare-grid">
        <div class="compare-tile compare-tile--orig">
          <div class="compare-tile__label">Original Total</div>
          <div class="compare-tile__price">${formatPrice(originalTotal)}</div>
        </div>
        <div class="compare-tile compare-tile--best">
          <div class="compare-tile__label">Lower-cost Total</div>
          <div class="compare-tile__price">${formatPrice(lowerTotal)}</div>
        </div>
        <div class="compare-tile" style="background:var(--secondary)">
          <div class="compare-tile__label">Potential Savings</div>
          <div class="compare-tile__price" style="color:var(--success)">${formatPrice(savings)}</div>
        </div>
      </div>
      <div class="alert alert--warn mt-2">
        <span class="alert__icon">⚠</span>
        <span>Please confirm any substitutions with your pharmacist or doctor before switching medicines.</span>
      </div>
      <button class="btn btn--primary mt-2" type="button" id="addAllToCart">Add All to Cart</button>
    </div>`;

  resultsSection.querySelectorAll('[data-add]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.add);
      const med = getMedicineById(id);
      const item = items.find((i) => i.id === id);
      addToCart(id, item ? item.qty : 1);
    });
  });

  const addAll = document.getElementById('addAllToCart');
  if (addAll) {
    addAll.addEventListener('click', () => {
      items.forEach((med) => addToCart(med.id, med.qty));
      setTimeout(() => (window.location.href = 'cart.html'), 700);
    });
  }
}
