import { calculateCartTotals, getCart, removeFromCart, saveCart, updateQuantity } from './modules/cart.js';

const itemsContainer = document.querySelector('[data-cart-items]');
const layout = document.querySelector('[data-cart-layout]');
const emptyState = document.querySelector('[data-empty-cart]');
const countLabel = document.querySelector('[data-cart-count-label]');
const clearButton = document.querySelector('[data-clear-cart]');
const subtotal = document.querySelector('[data-subtotal]');
const delivery = document.querySelector('[data-delivery]');
const tax = document.querySelector('[data-tax]');
const total = document.querySelector('[data-total]');
const summaryCount = document.querySelector('[data-summary-count]');

const formatPrice = (value) => `₹${value.toLocaleString('en-IN')}`;

function renderCart() {
  const cart = getCart();
  const totals = calculateCartTotals(cart);
  const isEmpty = cart.length === 0;

  layout.hidden = isEmpty;
  emptyState.hidden = !isEmpty;
  countLabel.textContent = `${totals.itemCount} ${totals.itemCount === 1 ? 'item' : 'items'} in your cart`;
  subtotal.textContent = formatPrice(totals.subtotal);
  delivery.textContent = formatPrice(totals.delivery);
  tax.textContent = formatPrice(totals.tax);
  total.textContent = formatPrice(totals.total);
  summaryCount.textContent = `(${totals.itemCount} ${totals.itemCount === 1 ? 'item' : 'items'})`;

  itemsContainer.innerHTML = cart.map((item) => `
    <article class="cart-item">
      <img class="cart-item-image" src="${item.image}" alt="${item.name}">
      <div class="cart-item-info"><h3>${item.name}</h3><p>${item.cuisine || 'NOIR favorite'}</p><div class="cart-item-price">${formatPrice(item.price)} each</div></div>
      <div class="quantity-control" aria-label="Quantity for ${item.name}"><button type="button" data-decrease="${item.id}" aria-label="Decrease quantity">−</button><span>${item.quantity}</span><button type="button" data-increase="${item.id}" aria-label="Increase quantity">+</button></div>
      <strong class="item-total">${formatPrice(item.price * item.quantity)}</strong>
      <button class="remove-item" type="button" data-remove="${item.id}" aria-label="Remove ${item.name}">×</button>
    </article>`).join('');

  itemsContainer.querySelectorAll('[data-increase]').forEach((button) => button.addEventListener('click', () => { updateQuantity(button.dataset.increase, 1); renderCart(); }));
  itemsContainer.querySelectorAll('[data-decrease]').forEach((button) => button.addEventListener('click', () => { updateQuantity(button.dataset.decrease, -1); renderCart(); }));
  itemsContainer.querySelectorAll('[data-remove]').forEach((button) => button.addEventListener('click', () => { removeFromCart(button.dataset.remove); renderCart(); }));
}

clearButton?.addEventListener('click', () => { saveCart([]); renderCart(); });
window.addEventListener('foodieverse:cart-updated', renderCart);
renderCart();
