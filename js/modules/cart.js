const CART_KEY = 'foodieVerseCart';
export const DELIVERY_CHARGE = 49;
export const TAX_RATE = 0.05;

export function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; }
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent('foodieverse:cart-updated', { detail: cart }));
  return cart;
}

export function addToCart(item) {
  const cart = getCart();
  const existing = cart.find((cartItem) => cartItem.id === item.id);
  if (existing) existing.quantity += 1;
  else cart.push({ ...item, quantity: 1 });
  return saveCart(cart);
}

export function updateQuantity(id, change) {
  const cart = getCart();
  const item = cart.find((cartItem) => cartItem.id === id);
  if (!item) return cart;
  item.quantity += change;
  return saveCart(cart.filter((cartItem) => cartItem.quantity > 0));
}

export function removeFromCart(id) {
  return saveCart(getCart().filter((item) => item.id !== id));
}

export function getCartItemCount() {
  return getCart().reduce((total, item) => total + item.quantity, 0);
}

export function calculateCartTotals(cart = getCart()) {
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const delivery = subtotal > 0 ? DELIVERY_CHARGE : 0;
  const tax = Math.round(subtotal * TAX_RATE);
  return { itemCount, subtotal, delivery, tax, total: subtotal + delivery + tax };
}
