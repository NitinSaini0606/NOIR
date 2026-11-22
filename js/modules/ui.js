import { addToCart } from './cart.js';

const categoryLabels = { starters: 'Starters', 'main-course': 'Main course', desserts: 'Desserts', beverages: 'Beverages' };

export function renderFoodCards(dishes, container, { showCuisine = false } = {}) {
  container.innerHTML = dishes.map((food) => `
    <article class="food-card">
      <div class="food-card-image">
        <img src="${food.image}" alt="${food.name}" loading="lazy">
        <span class="food-category">${categoryLabels[food.category]}</span>
        <span class="food-rating">★ ${food.rating}</span>
      </div>
      <div class="food-card-body">
        <h3>${food.name}</h3>
        ${showCuisine ? `<span class="food-cuisine">${food.cuisine}</span>` : ''}
        <p>${food.description}</p>
        <div class="food-card-footer"><strong>₹${food.price}</strong><button class="add-to-cart" type="button" data-food-id="${food.id}">+ Add to cart</button></div>
      </div>
    </article>`).join('');

  container.querySelectorAll('[data-food-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const food = dishes.find((item) => item.id === button.dataset.foodId);
      addToCart(food);
      button.textContent = 'Added ✓';
      button.classList.add('added');
      window.setTimeout(() => { button.textContent = '+ Add to cart'; button.classList.remove('added'); }, 1300);
    });
  });
}
