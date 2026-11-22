import { cuisineData } from './modules/food-data.js';
import { addToCart } from './modules/cart.js';
import { renderFoodCards } from './modules/ui.js';

const searchForm = document.querySelector('#search');
const searchInput = document.querySelector('#dish-search');
const clearSearchButton = document.querySelector('#clear-search');
const clearResultsButton = document.querySelector('[data-clear-search]');
const searchResults = document.querySelector('[data-search-results]');
const searchGrid = document.querySelector('[data-search-grid]');
const searchSummary = document.querySelector('[data-search-summary]');
const noResults = document.querySelector('[data-no-results]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const mainNav = document.querySelector('[data-main-nav]');

const allDishes = Object.entries(cuisineData).flatMap(([cuisineKey, cuisine]) => cuisine.dishes.map((food) => ({
  ...food,
  cuisine: cuisine.name,
  cuisineKey,
  searchText: `${food.name} ${cuisine.name} ${food.category} ${food.description}`.toLowerCase()
})));

document.querySelectorAll('[data-home-food]').forEach((button) => {
  button.addEventListener('click', () => {
    const food = allDishes.find((item) => item.id === button.dataset.homeFood);
    if (!food) return;
    addToCart(food);
    button.textContent = 'Added ✓';
    button.classList.add('added');
    window.setTimeout(() => { button.textContent = '+ Add'; button.classList.remove('added'); }, 1300);
  });
});

function setSearchVisibility(hasQuery) {
  if (searchResults) searchResults.hidden = !hasQuery;
  if (clearSearchButton) clearSearchButton.hidden = !hasQuery;
}

function runGlobalSearch(query) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    setSearchVisibility(false);
    return;
  }

  const matches = allDishes.filter((food) => food.searchText.includes(normalizedQuery));
  setSearchVisibility(true);
  if (searchSummary) searchSummary.textContent = `${matches.length} ${matches.length === 1 ? 'dish' : 'dishes'} matching “${query.trim()}”`;
  if (searchGrid) searchGrid.hidden = matches.length === 0;
  if (noResults) noResults.hidden = matches.length > 0;
  if (matches.length > 0) renderFoodCards(matches, searchGrid, { showCuisine: true });
  searchResults?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function clearSearch() {
  if (searchInput) searchInput.value = '';
  setSearchVisibility(false);
  if (searchGrid) searchGrid.innerHTML = '';
  if (noResults) noResults.hidden = true;
  searchInput?.focus();
}

searchForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  runGlobalSearch(searchInput.value);
});

searchInput?.addEventListener('input', () => {
  if (searchInput.value.trim()) runGlobalSearch(searchInput.value);
  else clearSearch();
});

clearSearchButton?.addEventListener('click', clearSearch);
clearResultsButton?.addEventListener('click', clearSearch);

menuToggle?.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('[data-copy-code]').forEach((button) => {
  button.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText('FIRSTBITE'); button.innerHTML = 'Copied! <strong>FIRSTBITE</strong>'; }
    catch { button.innerHTML = 'Use code <strong>FIRSTBITE</strong>'; }
  });
});

document.querySelectorAll('.save-button').forEach((button) => {
  button.addEventListener('click', () => { button.textContent = button.textContent === '♡' ? '♥' : '♡'; button.classList.toggle('is-saved'); });
});
