/* ============================================================
   MedFind — Core app: auth, nav, toasts, shared helpers
   ============================================================ */

import { getMedicineById } from './medicines.js';

/* ---------- Storage keys ---------- */
const SESSION_KEY = 'medfind_session';
const CART_KEY = 'medfind_cart';
const SELECTED_MED_KEY = 'medfind_selected_med';
const PRESCRIPTION_KEY = 'medfind_prescription';

/* ---------- Auth ---------- */
export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
  } catch {
    return null;
  }
}

export function setSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function isLoggedIn() {
  return !!getSession();
}

export function requireAuth(redirect) {
  if (!isLoggedIn()) {
    toast('Please log in to continue', 'warn');
    setTimeout(() => {
      window.location.href = `login.html?redirect=${encodeURIComponent(redirect || window.location.pathname)}`;
    }, 900);
    return false;
  }
  return true;
}

/* ---------- Toast notifications ---------- */
export function toast(message, type = '') {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'toast-wrap';
    wrap.setAttribute('aria-live', 'polite');
    document.body.appendChild(wrap);
  }
  const el = document.createElement('div');
  el.className = `toast ${type ? `toast--${type}` : ''}`;
  el.textContent = message;
  el.setAttribute('role', 'status');
  wrap.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 300);
  }, 2800);
}

/* ---------- Selected medicine (for details / alternatives pages) ---------- */
export function setSelectedMedicine(id) {
  localStorage.setItem(SELECTED_MED_KEY, String(id));
}

export function getSelectedMedicineId() {
  return localStorage.getItem(SELECTED_MED_KEY);
}

/* ---------- Prescription storage ---------- */
export function savePrescription(data) {
  localStorage.setItem(PRESCRIPTION_KEY, JSON.stringify(data));
}

export function getPrescription() {
  try {
    return JSON.parse(localStorage.getItem(PRESCRIPTION_KEY)) || null;
  } catch {
    return null;
  }
}

export function clearPrescription() {
  localStorage.removeItem(PRESCRIPTION_KEY);
}

/* ---------- Header / Nav ---------- */
export function renderHeader(activePage) {
  const header = document.querySelector('[data-header]');
  if (!header) return;

  const session = getSession();
  const links = [
    { key: 'home', href: 'index.html', label: 'Home' },
    { key: 'medicines', href: 'medicines.html', label: 'Medicines' },
    { key: 'prescription', href: 'prescription.html', label: 'Prescription' },
    { key: 'alternatives', href: 'alternatives.html', label: 'Alternatives' },
    { key: 'cart', href: 'cart.html', label: 'Cart' }
  ];

  const linksHtml = links
    .map(
      (l) =>
        `<a class="nav__link ${l.key === activePage ? 'active' : ''}" href="${l.href}">${l.label}</a>`
    )
    .join('');

  const authHtml = session
    ? `
      <span class="nav__user is-auth" id="navUser">
        <span class="nav__user-name">Hi, ${escapeHtml(session.name.split(' ')[0])}</span>
        <button class="btn btn--ghost btn--sm" id="logoutBtn" type="button">Log out</button>
      </span>`
    : `
      <span class="nav__auth" id="navAuth">
        <a class="btn btn--ghost btn--sm" href="login.html">Login</a>
        <a class="btn btn--primary btn--sm" href="signup.html">Sign Up</a>
      </span>`;

  header.innerHTML = `
    <nav class="nav" id="mainNav" aria-label="Primary navigation">
      <a class="nav__brand" href="index.html" aria-label="MedFind home">
        <span class="nav__logo"><span class="pill-mark">✚</span> MedFind</span>
        <span class="nav__tagline">Find your medicine easily</span>
      </a>
      <ul class="nav__links">${linksHtml}</ul>
      <a class="nav__cart-btn" href="cart.html" aria-label="View cart">
        Cart <span class="nav__cart-badge" id="cartBadge" data-count="0">0</span>
      </a>
      ${authHtml}
      <button class="nav__toggle" id="navToggle" type="button" aria-label="Toggle menu" aria-expanded="false">
        <span></span>
      </button>
    </nav>`;

  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      clearSession();
      toast('You have been logged out', 'ok');
      setTimeout(() => window.location.reload(), 600);
    });
  }

  updateCartBadge();
}

/* ---------- Footer ---------- */
export function renderFooter() {
  const footer = document.querySelector('[data-footer]');
  if (!footer) return;
  footer.innerHTML = `
    <div class="container">
      <div class="footer__disclaimer">
        MedFind provides medicine information and price comparison for informational purposes only.
        Always consult a qualified doctor or pharmacist before starting, stopping, or substituting a medicine.
      </div>
      <div class="footer__grid">
        <div>
          <div class="footer__brand">MedFind</div>
          <p class="footer__tag">Find your medicine. Compare your options. Save your time.</p>
        </div>
        <div class="footer__col">
          <h4>Explore</h4>
          <a href="index.html">Home</a>
          <a href="medicines.html">Medicines</a>
          <a href="prescription.html">Prescription</a>
          <a href="alternatives.html">Alternatives</a>
        </div>
        <div class="footer__col">
          <h4>Account</h4>
          <a href="login.html">Login</a>
          <a href="signup.html">Sign Up</a>
          <a href="cart.html">Your Cart</a>
        </div>
        <div class="footer__col">
          <h4>Support</h4>
          <a href="#">Help Center</a>
          <a href="#">Contact Us</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Use</a>
        </div>
      </div>
      <div class="footer__bottom">
        &copy; ${new Date().getFullYear()} MedFind. A university prototype. Not a medical advice service.
      </div>
    </div>`;
}

/* ---------- Cart badge ---------- */
export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

export function updateCartBadge() {
  const cart = getCart();
  const total = cart.reduce((s, i) => s + i.qty, 0);
  const badge = document.getElementById('cartBadge');
  if (badge) {
    badge.textContent = total;
    badge.dataset.count = total;
  }
}

/* ---------- Cart actions (shared) ---------- */
export function addToCart(id, qty = 1) {
  const med = getMedicineById(id);
  if (!med) return;
  const cart = getCart();
  const existing = cart.find((i) => i.id === id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: med.id, name: med.name, price: med.price, icon: med.icon, qty });
  }
  saveCart(cart);
  toast(`${med.name} added to cart`, 'ok');
}

export function removeFromCart(id) {
  let cart = getCart();
  const item = cart.find((i) => i.id === id);
  cart = cart.filter((i) => i.id !== id);
  saveCart(cart);
  if (item) toast(`${item.name} removed from cart`, 'err');
}

/* ---------- Misc helpers ---------- */
export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

/* ---------- Form validation helpers ---------- */
export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone) {
  return /^[0-9+\-\s()]{7,16}$/.test(phone);
}

export function setFieldError(fieldEl, message) {
  fieldEl.classList.add('has-error');
  const err = fieldEl.querySelector('.field__error');
  if (err && message) err.textContent = message;
}

export function clearFieldError(fieldEl) {
  fieldEl.classList.remove('has-error');
}

/* ---------- Init shared UI ---------- */
export function initPage(activePage) {
  renderHeader(activePage);
  renderFooter();
  document.title = `MedFind — ${activePage.charAt(0).toUpperCase() + activePage.slice(1)}`;
}
