import { getCurrentUser, logout } from './modules/auth.js';

const user = getCurrentUser();
const greeting = document.querySelector('[data-user-greeting]');
const authLink = document.querySelector('[data-auth-link]');
const profileLink = document.querySelector('[data-profile-link]');
const profileName = document.querySelector('[data-profile-name]');
const profileAvatar = document.querySelector('[data-profile-avatar]');
const cartCount = document.querySelector('[data-cart-count]');

if (greeting) {
  greeting.textContent = user ? `Welcome back, ${user.fullName.split(' ')[0]}.` : 'Find your flavor.';
}

if (authLink) {
  if (user) {
    authLink.textContent = 'Log out';
    authLink.href = '#';
    authLink.addEventListener('click', (event) => {
      event.preventDefault();
      logout();
      window.location.reload();
    });
  } else {
    authLink.textContent = 'Sign in';
    authLink.href = 'login.html';
  }
}

if (user && profileName && profileAvatar && profileLink) {
  profileName.textContent = user.fullName;
  profileAvatar.textContent = user.fullName.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
  profileLink.href = '#';
  profileLink.addEventListener('click', (event) => {
    event.preventDefault();
    logout();
    window.location.reload();
  });
}

if (cartCount) {
  const updateCartCount = (cart = []) => {
    cartCount.textContent = cart.reduce((total, item) => total + (item.quantity || 0), 0);
  };
  try { updateCartCount(JSON.parse(localStorage.getItem('foodieVerseCart')) || []); }
  catch { updateCartCount(); }
  window.addEventListener('foodieverse:cart-updated', (event) => updateCartCount(event.detail));
}
