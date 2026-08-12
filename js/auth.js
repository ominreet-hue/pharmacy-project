/* ============================================================
   MedFind — Auth pages (signup + login) logic
   ============================================================ */

import {
  initPage,
  toast,
  setSession,
  getSession,
  clearFieldError,
  setFieldError,
  validateEmail,
  validatePhone,
  getQueryParam,
  escapeHtml
} from './app.js';

const page = window.location.pathname.includes('signup') ? 'signup' : 'login';
initPage(page === 'signup' ? 'signup' : 'login');

/* Redirect away if already logged in (unless coming from logout) */
const session = getSession();
if (session && !getQueryParam('reauth')) {
  window.location.href = 'index.html';
}

/* ---- Sign Up ---- */
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirm').value;

    let valid = true;

    resetFields(['field-name', 'field-email', 'field-phone', 'field-password', 'field-confirm']);

    if (!name || name.length < 2) {
      setFieldError(document.getElementById('field-name'), 'Please enter your full name.');
      valid = false;
    }
    if (!validateEmail(email)) {
      setFieldError(document.getElementById('field-email'), 'Please enter a valid email address.');
      valid = false;
    }
    if (!validatePhone(phone)) {
      setFieldError(document.getElementById('field-phone'), 'Please enter a valid phone number.');
      valid = false;
    }
    if (password.length < 6) {
      setFieldError(document.getElementById('field-password'), 'Password must be at least 6 characters.');
      valid = false;
    }
    if (confirm !== password) {
      setFieldError(document.getElementById('field-confirm'), 'Passwords do not match.');
      valid = false;
    }

    if (!valid) {
      toast('Please fix the highlighted fields', 'err');
      return;
    }

    setSession({ name, email, phone, createdAt: Date.now() });
    toast('Account created successfully', 'ok');
    setTimeout(() => (window.location.href = 'index.html'), 800);
  });
}

/* ---- Login ---- */
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const login = document.getElementById('login').value.trim();
    const password = document.getElementById('password').value;

    resetFields(['field-login', 'field-password']);

    let valid = true;
    if (!login) {
      setFieldError(document.getElementById('field-login'), 'Please enter your email or phone number.');
      valid = false;
    }
    if (!password) {
      setFieldError(document.getElementById('field-password'), 'Please enter your password.');
      valid = false;
    }

    if (!valid) {
      toast('Please fill in all fields', 'err');
      return;
    }

    /* Prototype: accept any login — store a generic session */
    const name = validateEmail(login)
      ? login.split('@')[0].replace(/[._-]/g, ' ')
      : 'Valued Customer';
    setSession({ name: name.charAt(0).toUpperCase() + name.slice(1), email: validateEmail(login) ? login : '', phone: validatePhone(login) ? login : '', createdAt: Date.now() });
    toast('Logged in successfully', 'ok');

    const redirect = getQueryParam('redirect');
    setTimeout(() => (window.location.href = redirect || 'index.html'), 800);
  });

  const forgot = document.getElementById('forgotLink');
  if (forgot) {
    forgot.addEventListener('click', (e) => {
      e.preventDefault();
      toast('Password reset is not available in this prototype', 'warn');
    });
  }
}

/* ---- Helpers ---- */
function resetFields(ids) {
  ids.forEach((id) => clearFieldError(document.getElementById(id)));
}
