import { loginUser, registerUser } from './modules/auth.js';

const $ = (selector, parent = document) => parent.querySelector(selector);

function showMessage(element, message, type = 'error') {
  element.textContent = message;
  element.className = `form-message ${type} is-visible`;
}

function clearErrors(form) {
  form.querySelectorAll('.field-error').forEach((error) => {
    error.textContent = '';
    error.classList.remove('is-visible');
  });
  form.querySelectorAll('input').forEach((input) => input.removeAttribute('aria-invalid'));
}

function setError(input, message) {
  const error = $(`[data-error-for="${input.id}"]`);
  input.setAttribute('aria-invalid', 'true');
  if (error) {
    error.textContent = message;
    error.classList.add('is-visible');
  }
}

function setupPasswordToggles() {
  document.querySelectorAll('[data-password-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const input = document.getElementById(button.dataset.passwordToggle);
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      button.textContent = isPassword ? 'Hide' : 'Show';
      button.setAttribute('aria-label', `${isPassword ? 'Hide' : 'Show'} password`);
    });
  });
}

function validateSignup(form) {
  const values = Object.fromEntries(new FormData(form));
  const inputs = {
    fullName: $('#signup-name'),
    email: $('#signup-email'),
    phone: $('#signup-phone'),
    password: $('#signup-password'),
    confirmPassword: $('#signup-confirm-password')
  };
  let valid = true;

  if (values.fullName.trim().length < 2) {
    setError(inputs.fullName, 'Please enter your full name.');
    valid = false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    setError(inputs.email, 'Enter a valid email address.');
    valid = false;
  }
  if (values.phone.replace(/\D/g, '').length < 7) {
    setError(inputs.phone, 'Enter a valid phone number.');
    valid = false;
  }
  if (values.password.length < 6) {
    setError(inputs.password, 'Password must be at least 6 characters.');
    valid = false;
  }
  if (values.password !== values.confirmPassword) {
    setError(inputs.confirmPassword, 'Passwords do not match.');
    valid = false;
  }

  return { valid, values };
}

function validateLogin(form) {
  const values = Object.fromEntries(new FormData(form));
  const identifier = $('#login-identifier');
  const password = $('#login-password');
  let valid = true;

  if (!values.identifier.trim()) {
    setError(identifier, 'Enter your email or phone number.');
    valid = false;
  }
  if (!values.password) {
    setError(password, 'Enter your password.');
    valid = false;
  }

  return { valid, values };
}

function setupSignup() {
  const form = $('#signup-form');
  if (!form) return;
  const message = $('#signup-message');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearErrors(form);
    message.className = 'form-message';
    const result = validateSignup(form);
    if (!result.valid) return;

    const registration = registerUser(result.values);
    if (!registration.ok) {
      showMessage(message, registration.message);
      return;
    }

    showMessage(message, 'Account created. Redirecting you to sign in…', 'success');
    window.setTimeout(() => { window.location.href = 'login.html'; }, 700);
  });
}

function setupLogin() {
  const form = $('#login-form');
  if (!form) return;
  const message = $('#login-message');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearErrors(form);
    message.className = 'form-message';
    const result = validateLogin(form);
    if (!result.valid) return;

    const login = loginUser(result.values.identifier, result.values.password);
    if (!login.ok) {
      showMessage(message, login.message);
      return;
    }

    window.location.href = '../index.html';
  });
}

setupPasswordToggles();
setupSignup();
setupLogin();
