document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const hamburger = document.querySelector('.hamburger');
  const menuCategories = document.querySelector('.menu-categories');
  const categoryButtons = document.querySelectorAll('.category-btn');
  const menuItems = document.querySelectorAll('.menu-item');

  // Search input
  const searchInput = document.querySelector('.search-input');

  // Cart Elements
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  const cartBadge = document.getElementById('cart-badge');
  const cartToggle = document.querySelector('.cart-toggle');
  const cartSection = document.getElementById('cart-section');
  const cartOverlay = document.getElementById('cart-overlay');
  const closeCartBtn = document.querySelector('.close-cart');
  const checkoutButton = document.querySelector('.checkout-btn');

  // Modal Elements
  const instructionsModal = document.getElementById('instructions-modal');
  const specialInstructions = document.getElementById('special-instructions');
  const closeModalBtn = document.querySelector('.close-modal');
  const submitInstructionsBtn = document.querySelector('.submit-instructions');

  // Feedback button
  const feedbackBtn = document.getElementById('feedback-btn');

  // Cart data and currently selected item
  let cart = [];
  let currentItem = null;

  // -------------------
  // Hamburger toggle for mobile menu
  // -------------------
  if (hamburger && menuCategories) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      menuCategories.classList.toggle('active');
      // Optionally manage aria-expanded for accessibility
      const expanded = hamburger.classList.contains('active');
      hamburger.setAttribute('aria-expanded', expanded);
    });
  }

  // -------------------
  // Category filtering
  // -------------------
  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const category = button.dataset.category;

      menuItems.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // -------------------
  // Search functionality
  // -------------------
  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();

    menuItems.forEach(item => {
      const name = item.querySelector('.item-name').textContent.toLowerCase();
      const description = item.querySelector('.item-description').textContent.toLowerCase();

      if (name.includes(searchTerm) || description.includes(searchTerm)) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  });

  // -------------------
  // Cart toggle visibility
  // -------------------
  function toggleCart(show) {
    if (show) {
      cartSection.classList.add('visible');
      cartOverlay.classList.add('visible');
      cartToggle.setAttribute('aria-expanded', 'true');
    } else {
      cartSection.classList.remove('visible');
      cartOverlay.classList.remove('visible');
      cartToggle.setAttribute('aria-expanded', 'false');
    }
  }

  cartToggle.addEventListener('click', () => toggleCart(true));
  closeCartBtn.addEventListener('click', () => toggleCart(false));
  cartOverlay.addEventListener('click', () => toggleCart(false));

  // -------------------
  // Special instructions modal open
  // -------------------
  addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      currentItem = button.closest('.menu-item');
      instructionsModal.classList.add('visible');
      specialInstructions.value = '';
      specialInstructions.focus();
      // Add focus trap for modal
      trapFocus(instructionsModal);
    });
  });

  // -------------------
  // Close modal handlers
  // -------------------
  function closeModal() {
    instructionsModal.classList.remove('visible');
    specialInstructions.value = '';
    currentItem = null;
    releaseFocusTrap();
  }

  closeModalBtn.addEventListener('click', closeModal);

  // Close modal on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && instructionsModal.classList.contains('visible')) {
      closeModal();
    }
  });

  // -------------------
  // Submit special instructions to cart
  // -------------------
  submitInstructionsBtn.addEventListener('click', addItemToCart);

  // Enter key submits if not shift+enter
  specialInstructions.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addItemToCart();
    }
  });

  function addItemToCart() {
    if (!currentItem) return;

    const itemName = currentItem.querySelector('.item-name').textContent;
    const itemPrice = parseFloat(currentItem.querySelector('.item-price').textContent.replace('$', ''));
    const instructions = specialInstructions.value.trim();

    // Combine name + instructions to identify unique cart items
    const existingIndex = cart.findIndex(
      item => item.name === itemName && item.instructions === instructions
    );

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        name: itemName,
        price: itemPrice,
        quantity: 1,
        instructions: instructions
      });
    }

    saveCart();
    updateCart();
    closeModal();
  }

  // -------------------
  // Cart update UI
  // -------------------
  function updateCart() {
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
      cartBadge.style.display = 'none';
      cartTotal.textContent = '0.00';
      return;
    }

    let total = 0;
    let itemCount = 0;

    cart.forEach((item, index) => {
      const cartItemElement = document.createElement('div');
      cartItemElement.className = 'cart-item';

      let instructionsHTML = '';
      if (item.instructions) {
        instructionsHTML = `<div class="cart-item-instructions">${item.instructions}</div>`;
      }

      cartItemElement.innerHTML = `
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${item.price.toFixed(2)}</div>
          ${instructionsHTML}
        </div>
        <div class="cart-item-controls">
          <div class="quantity-controls">
            <button class="quantity-btn decrease" data-index="${index}" aria-label="Decrease quantity of ${item.name}">−</button>
            <span class="quantity-value" aria-live="polite">${item.quantity}</span>
            <button class="quantity-btn increase" data-index="${index}" aria-label="Increase quantity of ${item.name}">+</button>
          </div>
          <button class="delete-item" data-index="${index}" aria-label="Remove ${item.name} from cart">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;

      cartItemsContainer.appendChild(cartItemElement);

      total += item.price * item.quantity;
      itemCount += item.quantity;
    });

    // Attach event listeners to quantity and delete buttons
    document.querySelectorAll('.decrease').forEach(button => {
      button.addEventListener('click', () => {
        const index = parseInt(button.dataset.index);
        if (cart[index].quantity > 1) {
          cart[index].quantity -= 1;
        } else {
          cart.splice(index, 1);
        }
        saveCart();
        updateCart();
      });
    });

    document.querySelectorAll('.increase').forEach(button => {
      button.addEventListener('click', () => {
        const index = parseInt(button.dataset.index);
        cart[index].quantity += 1;
        saveCart();
        updateCart();
      });
    });

    document.querySelectorAll('.delete-item').forEach(button => {
      button.addEventListener('click', () => {
        const index = parseInt(button.dataset.index);
        cart.splice(index, 1);
        saveCart();
        updateCart();
      });
    });

    cartBadge.textContent = itemCount;
    cartBadge.style.display = 'flex';
    cartTotal.textContent = total.toFixed(2);
  }

  // -------------------
  // Checkout
  // -------------------
  checkoutButton.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    alert(`Order placed! Total: $${parseFloat(cartTotal.textContent).toFixed(2)}`);
    cart = [];
    saveCart();
    updateCart();
    toggleCart(false);
  });

  // -------------------
  // Feedback button - redirect to feedback page
  // -------------------
  feedbackBtn.addEventListener('click', () => {
    window.location.href = 'feedback.html';
  });

  // -------------------
  // Persist cart to localStorage
  // -------------------
  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        cart = JSON.parse(savedCart);
      } catch {
        cart = [];
      }
    }
  }

  loadCart();
  updateCart();

  // -------------------
  // Focus Trap for Modal (basic implementation)
  // -------------------
  let focusableElements = [];
  let firstFocusable = null;
  let lastFocusable = null;

  function trapFocus(element) {
    focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length === 0) return;

    firstFocusable = focusableElements[0];
    lastFocusable = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', handleTrapFocus);
  }

  function releaseFocusTrap() {
    instructionsModal.removeEventListener('keydown', handleTrapFocus);
  }

  function handleTrapFocus(e) {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  }
});
