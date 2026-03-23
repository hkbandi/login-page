'use strict';

const form = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');
const errorBanner = document.getElementById('error-message');
const submitBtn = document.getElementById('submit-btn');
const btnText = submitBtn.querySelector('.btn-text');
const btnSpinner = submitBtn.querySelector('.btn-spinner');
const toggleBtn = document.querySelector('.toggle-password');
const eyeIcon = toggleBtn.querySelector('.eye-icon');
const eyeOffIcon = toggleBtn.querySelector('.eye-off-icon');

// ── Validation helpers ──────────────────────────────────────────────────────

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function setFieldError(input, errorEl, message) {
  errorEl.textContent = message;
  input.classList.toggle('invalid', !!message);
}

function clearErrors() {
  setFieldError(emailInput, emailError, '');
  setFieldError(passwordInput, passwordError, '');
  errorBanner.textContent = '';
  errorBanner.classList.remove('visible', 'success');
}

function showBanner(type, message) {
  errorBanner.textContent = message;
  errorBanner.classList.add('visible');
  if (type === 'success') {
    errorBanner.classList.add('success');
  } else {
    errorBanner.classList.remove('success');
  }
}

function validateForm() {
  let valid = true;

  if (!emailInput.value.trim()) {
    setFieldError(emailInput, emailError, 'Email is required.');
    valid = false;
  } else if (!isValidEmail(emailInput.value)) {
    setFieldError(emailInput, emailError, 'Enter a valid email address.');
    valid = false;
  } else {
    setFieldError(emailInput, emailError, '');
  }

  if (!passwordInput.value) {
    setFieldError(passwordInput, passwordError, 'Password is required.');
    valid = false;
  } else if (passwordInput.value.length < 6) {
    setFieldError(passwordInput, passwordError, 'Password must be at least 6 characters.');
    valid = false;
  } else {
    setFieldError(passwordInput, passwordError, '');
  }

  return valid;
}

// ── Password visibility toggle ──────────────────────────────────────────────

toggleBtn.addEventListener('click', () => {
  const isPassword = passwordInput.type === 'password';
  passwordInput.type = isPassword ? 'text' : 'password';
  eyeIcon.classList.toggle('hidden', isPassword);
  eyeOffIcon.classList.toggle('hidden', !isPassword);
  toggleBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
});

// ── Inline validation on blur ───────────────────────────────────────────────

emailInput.addEventListener('blur', () => {
  if (!emailInput.value.trim()) {
    setFieldError(emailInput, emailError, 'Email is required.');
  } else if (!isValidEmail(emailInput.value)) {
    setFieldError(emailInput, emailError, 'Enter a valid email address.');
  } else {
    setFieldError(emailInput, emailError, '');
  }
});

passwordInput.addEventListener('blur', () => {
  if (!passwordInput.value) {
    setFieldError(passwordInput, passwordError, 'Password is required.');
  } else if (passwordInput.value.length < 6) {
    setFieldError(passwordInput, passwordError, 'Password must be at least 6 characters.');
  } else {
    setFieldError(passwordInput, passwordError, '');
  }
});

// Clear field error while user types
emailInput.addEventListener('input', () => {
  if (emailInput.classList.contains('invalid')) {
    setFieldError(emailInput, emailError, '');
  }
});

passwordInput.addEventListener('input', () => {
  if (passwordInput.classList.contains('invalid')) {
    setFieldError(passwordInput, passwordError, '');
  }
});

// ── Form submit ─────────────────────────────────────────────────────────────

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors();

  if (!validateForm()) return;

  // Show loading state
  submitBtn.disabled = true;
  btnText.textContent = 'Signing in…';
  btnSpinner.classList.remove('hidden');

  try {
    await fakeLogin(emailInput.value.trim(), passwordInput.value);

    // ── Login successful ──
    btnSpinner.classList.add('hidden');
    btnText.textContent = 'Sign in';
    submitBtn.disabled = false;
    showBanner('success', '✅ Login successful! Welcome back.');

  } catch (err) {
    // ── Login failed ──
    showBanner('error', '❌ ' + (err.message || 'Login failed. Please try again.'));
    btnText.textContent = 'Sign in';
    btnSpinner.classList.add('hidden');
    submitBtn.disabled = false;
    passwordInput.value = '';
    passwordInput.focus();
  }
});

// ── Auth (checks against demo credentials) ─────────────────────────────────

const DEMO_EMAIL    = 'demo@demo.com';
const DEMO_PASSWORD = 'demo123';

function fakeLogin(email, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
        resolve({ token: 'demo-token' });
      } else {
        reject(new Error('Login failed. Invalid email or password.'));
      }
    }, 1200);
  });
}
