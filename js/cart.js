/* ============================================================
   MedFind — Cart page logic
   ============================================================ */

import {
  getCart,
  saveCart,
  addToCart,
  removeFromCart,
  toast,
  escapeHtml
} from './app.js';
import { getMedicineById, getCheapestAlternative, formatPrice, pharmacies } from './medicines.js';

/* ---------- Cart rendering ---------- */
export function renderCart() {
  const listEl = document.getElementById('cartList');
  const summaryEl = document.getElementById('cartSummary');
  const emptyEl = document.getElementById('cartEmpty');
  const contentEl = document.getElementById('cartContent');
  if (!listEl || !summaryEl) return;

  const cart = getCart();

  if (!cart.length) {
    if (contentEl) contentEl.classList.add('hide');
    if (emptyEl) emptyEl.classList.remove('hide');
    return;
  }

  if (contentEl) contentEl.classList.remove('hide');
  if (emptyEl) emptyEl.classList.add('hide');

  listEl.innerHTML = cart
    .map(
      (item) => `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item__icon">${item.icon || '💊'}</div>
        <div class="cart-item__body">
          <div class="cart-item__name">${escapeHtml(item.name)}</div>
          <div class="cart-item__meta">${formatPrice(item.price)} each</div>
        </div>
        <div class="qty" role="group" aria-label="Quantity">
          <button type="button" data-action="dec" aria-label="Decrease quantity">−</button>
          <span aria-live="polite">${item.qty}</span>
          <button type="button" data-action="inc" aria-label="Increase quantity">+</button>
        </div>
        <div class="cart-item__price">${formatPrice(item.price * item.qty)}</div>
        <button class="icon-btn" type="button" data-action="remove" aria-label="Remove ${escapeHtml(item.name)}">🗑</button>
      </div>`
    )
    .join('');

  attachCartEvents();
  renderSummary();
}

function attachCartEvents() {
  document.querySelectorAll('.cart-item').forEach((row) => {
    const id = Number(row.dataset.id);
    row.querySelectorAll('[data-action]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        const cart = getCart();
        const item = cart.find((i) => i.id === id);
        if (!item) return;
        if (action === 'inc') {
          item.qty += 1;
          saveCart(cart);
          toast('Your cart has been updated', 'ok');
        } else if (action === 'dec') {
          item.qty -= 1;
          if (item.qty <= 0) {
            removeFromCart(id);
            renderCart();
            renderLocationSection();
            return;
          }
          saveCart(cart);
          toast('Your cart has been updated', '');
        } else if (action === 'remove') {
          removeFromCart(id);
          renderCart();
          renderLocationSection();
          return;
        }
        renderCart();
      });
    });
  });
}

/* ---------- Summary ---------- */
export function renderSummary() {
  const summaryEl = document.getElementById('cartSummary');
  if (!summaryEl) return;
  const cart = getCart();
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  let savings = 0;
  cart.forEach((item) => {
    const med = getMedicineById(item.id);
    if (!med) return;
    const cheapest = getCheapestAlternative(item.id);
    if (cheapest && cheapest.price < med.price) {
      savings += (med.price - cheapest.price) * item.qty;
    }
  });

  const total = subtotal - savings;

  summaryEl.innerHTML = `
    <h3>Order Summary</h3>
    <div class="summary__row">
      <span>Subtotal</span>
      <span>${formatPrice(subtotal)}</span>
    </div>
    <div class="summary__row summary__savings">
      <span>Potential savings</span>
      <span>− ${formatPrice(savings)}</span>
    </div>
    <div class="summary__row summary__total">
      <span>Total</span>
      <span>${formatPrice(total)}</span>
    </div>
    <div class="alert alert--info mt-3">
      <span class="alert__icon">ℹ</span>
      <span>Switching to lower-cost alternatives could save you <strong>${formatPrice(savings)}</strong>. Confirm substitutions with your pharmacist.</span>
    </div>
    <button class="btn btn--primary btn--block mt-3" type="button" id="checkoutBtn">Proceed to Checkout</button>
    <a class="btn btn--ghost btn--block mt-2" href="medicines.html">Continue Shopping</a>`;

  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      toast('Checkout is not available in this prototype', 'warn');
    });
  }
}

/* ---------- Location / nearby pharmacies ---------- */
export function renderLocationSection() {
  const section = document.getElementById('locationSection');
  if (!section) return;
  const cart = getCart();
  if (!cart.length) {
    section.classList.add('hide');
    return;
  }
  section.classList.remove('hide');
}

export function initLocationFeature() {
  const findBtn = document.getElementById('findPharmaciesBtn');
  const input = document.getElementById('locationInput');
  const results = document.getElementById('pharmacyResults');
  if (!findBtn || !input || !results) return;

  findBtn.addEventListener('click', () => {
    const loc = input.value.trim();
    if (!loc) {
      toast('Please enter your location', 'warn');
      return;
    }
    toast('Searching nearby pharmacies...', '');
    setTimeout(() => {
      results.innerHTML = renderPharmacyCards(loc);
      attachPharmacyEvents();
    }, 500);
  });

  const geoBtn = document.getElementById('useGeoBtn');
  if (geoBtn) {
    geoBtn.addEventListener('click', () => {
      if (!navigator.geolocation) {
        toast('Geolocation is not supported on this device', 'warn');
        return;
      }
      geoBtn.disabled = true;
      geoBtn.textContent = 'Locating...';
      navigator.geolocation.getCurrentPosition(
        () => {
          input.value = 'Current location';
          geoBtn.disabled = false;
          geoBtn.textContent = 'Use my location';
          toast('Location detected', 'ok');
          results.innerHTML = renderPharmacyCards('Current location');
          attachPharmacyEvents();
        },
        () => {
          geoBtn.disabled = false;
          geoBtn.textContent = 'Use my location';
          toast('Location permission denied', 'err');
        }
      );
    });
  }
}

function renderPharmacyCards(loc) {
  const cart = getCart();
  const firstMed = cart[0] ? getMedicineById(cart[0].id) : null;
  const basePrice = firstMed ? firstMed.price : 50;

  const cards = pharmacies
    .map((p) => {
      const priceVariation = 1 + (p.id % 3) * 0.08 - 0.04;
      const estPrice = Math.round(basePrice * priceVariation);
      const available = p.id % 4 !== 0;
      return `
      <div class="pharm-card" data-id="${p.id}">
        <div class="pharm-card__head">
          <div>
            <div class="pharm-card__name">${escapeHtml(p.name)}</div>
            <div class="pharm-card__dist">${p.distance} km away &middot; ${escapeHtml(p.address)}</div>
            <div class="pharm-card__dist">Rating: ${p.rating} / 5</div>
          </div>
          <div class="pharm-card__price">${formatPrice(estPrice)}</div>
        </div>
        <div>${available ? '<span class="badge badge--ok">Medicine available</span>' : '<span class="badge badge--no">Out of stock</span>'}</div>
        <div>
          <button class="btn btn--primary btn--sm" type="button" data-action="select" ${available ? '' : 'disabled'}>
            Select Pharmacy
          </button>
        </div>
      </div>`;
    })
    .join('');

  return `<p class="text-muted mb-2">Showing pharmacies near <strong>${escapeHtml(loc)}</strong></p><div class="grid grid-auto">${cards}</div>`;
}

function attachPharmacyEvents() {
  document.querySelectorAll('.pharm-card [data-action="select"]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.pharm-card');
      const name = card.querySelector('.pharm-card__name').textContent;
      toast(`${name} selected for pickup`, 'ok');
      document.querySelectorAll('.pharm-card').forEach((c) => c.style.borderColor = '');
      card.style.borderColor = 'var(--accent)';
    });
  });
}

/* ---------- Page init ---------- */
export function initCartPage() {
  renderCart();
  renderLocationSection();
  initLocationFeature();
}
