import { cuisineData } from './modules/food-data.js';
import { renderFoodCards } from './modules/ui.js';

const key = document.body.dataset.cuisine;
const cuisine = cuisineData[key];
const cards = document.querySelector('[data-food-grid]');
const title = document.querySelector('[data-cuisine-name]');
const tagline = document.querySelector('[data-cuisine-tagline]');
const intro = document.querySelector('[data-cuisine-intro]');
const banner = document.querySelector('[data-cuisine-banner]');
const count = document.querySelector('[data-dish-count]');
const filterButtons = [...document.querySelectorAll('[data-filter]')];

if (cuisine) {
  document.title = `${cuisine.name} Cuisine | NOIR`;
  title.textContent = cuisine.name;
  tagline.textContent = cuisine.tagline;
  intro.textContent = cuisine.intro;
  banner.style.backgroundImage = `linear-gradient(90deg, rgba(31, 23, 19, .84), rgba(31, 23, 19, .24)), url('${cuisine.banner}')`;
  count.textContent = `${cuisine.dishes.length} dishes to discover`;

  const render = (filter = 'all') => {
    const dishes = filter === 'all' ? cuisine.dishes : cuisine.dishes.filter((food) => food.category === filter);
    renderFoodCards(dishes, cards);
    count.textContent = `${dishes.length} ${dishes.length === 1 ? 'dish' : 'dishes'} to discover`;
  };

  filterButtons.forEach((button) => button.addEventListener('click', () => {
    filterButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    render(button.dataset.filter);
  }));
  render();
}
