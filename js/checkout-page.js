import { getCurrentUser } from './modules/auth.js';
import { calculateCartTotals, getCart, saveCart } from './modules/cart.js';

const user = getCurrentUser();
const form = document.querySelector('#checkout-form');
const layout = document.querySelector('[data-checkout-layout]');
const confirmation = document.querySelector('[data-confirmation]');
const items = document.querySelector('[data-checkout-items]');
const message = document.querySelector('[data-checkout-message]');
const fields = { name: document.querySelector('#customer-name'), phone: document.querySelector('#customer-phone'), email: document.querySelector('#customer-email') };

const formatPrice = (value) => `₹${value.toLocaleString('en-IN')}`;

if (!user) {
  window.location.href = 'login.html';
} else {
  fields.name.value = user.fullName;
  fields.phone.value = user.phone;
  fields.email.value = user.email;
}

function renderSummary() {
  const cart = getCart();
  const totals = calculateCartTotals(cart);
  document.querySelector('[data-checkout-subtotal]').textContent = formatPrice(totals.subtotal);
  document.querySelector('[data-checkout-delivery]').textContent = formatPrice(totals.delivery);
  document.querySelector('[data-checkout-tax]').textContent = formatPrice(totals.tax);
  document.querySelector('[data-checkout-total]').textContent = formatPrice(totals.total);
  items.innerHTML = cart.map((item) => `<div class="checkout-item"><img src="${item.image}" alt="${item.name}"><div><strong>${item.name}</strong><p>Qty ${item.quantity}</p></div><b>${formatPrice(item.price * item.quantity)}</b></div>`).join('');
}

function showError(input, text) {
  input.setAttribute('aria-invalid', 'true');
  const error = document.querySelector(`[data-error-for="${input.id}"]`);
  error.textContent = text;
  error.classList.add('is-visible');
}

function clearErrors() {
  form.querySelectorAll('.checkout-error').forEach((error) => error.classList.remove('is-visible'));
  form.querySelectorAll('input').forEach((input) => input.removeAttribute('aria-invalid'));
  message.className = 'checkout-message';
}

function makeOrderId() {
  const date = new Date().toISOString().slice(0, 10).replaceAll('-', '');
  const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `FV-${date}-${suffix}`;
}

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  clearErrors();
  const values = Object.fromEntries(new FormData(form));
  let valid = true;
  if (values.fullName.trim().length < 2) { showError(fields.name, 'Please enter your full name.'); valid = false; }
  if (values.phone.replace(/\D/g, '').length < 7) { showError(fields.phone, 'Please enter a valid phone number.'); valid = false; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) { showError(fields.email, 'Please enter a valid email address.'); valid = false; }
  ['address-line', 'address-city', 'address-state', 'address-pincode'].forEach((id) => { const input = document.querySelector(`#${id}`); if (!input.value.trim() || (id === 'address-pincode' && !/^\d{5,6}$/.test(input.value.trim()))) { showError(input, id === 'address-pincode' ? 'Enter a valid PIN code.' : 'This field is required.'); valid = false; } });
  if (!valid) return;
  if (getCart().length === 0) { message.textContent = 'Your cart is empty. Add something delicious before placing an order.'; message.classList.add('is-visible'); return; }
  document.querySelector('[data-order-id]').textContent = makeOrderId();
  saveCart([]);
  layout.hidden = true;
  confirmation.hidden = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('foodieverse:cart-updated', renderSummary);
renderSummary();
