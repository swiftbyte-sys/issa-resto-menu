document.addEventListener('DOMContentLoaded', () => {
  // Initialize cart
  let cart = [];
  const cartItemsContainer = document.querySelector('.cart-items');
  const cartCount = document.querySelector('.cart-count');
  const cartBadge = document.querySelector('.cart-badge');
  const totalAmount = document.querySelector('.total-amount');
  const cartSidebar = document.querySelector('.cart-sidebar');
  const cartOverlay = document.querySelector('.cart-overlay');
  const closeCartBtn = document.querySelector('.close-cart');
  const cartBtn = document.querySelector('.cart-btn');
  const checkoutBtn = document.querySelector('.checkout-btn');
  
  // Initialize menu items with animations
  const items = document.querySelectorAll('.item');
  items.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.05}s`;
    
    // Add click handler for adding to cart
    const addToCartBtn = document.createElement('button');
    addToCartBtn.className = 'add-to-cart';
    addToCartBtn.innerHTML = '<i class="fas fa-plus"></i>';
    
    // Wrap item content in a div for better structure
    const itemContent = document.createElement('div');
    itemContent.className = 'item-info';
    itemContent.innerHTML = item.innerHTML;
    item.innerHTML = '';
    item.appendChild(itemContent);
    item.appendChild(addToCartBtn);
    
    addToCartBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(item);
    });
  });

  // Cart functionality
  function addToCart(itemElement) {
    const itemName = itemElement.querySelector('.item-name').textContent;
    const itemPrice = parseFloat(itemElement.querySelector('.item-price').textContent.replace('$', ''));
    
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.name === itemName);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        name: itemName,
        price: itemPrice,
        quantity: 1
      });
    }
    
    updateCart();
    animateAddToCart(itemElement);
  }
  
  function animateAddToCart(itemElement) {
    itemElement.style.transform = 'scale(0.95)';
    setTimeout(() => {
      itemElement.style.transform = '';
    }, 300);
  }
  
  function updateCart() {
    // Update cart UI
    cartItemsContainer.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
      total += item.price * item.quantity;
      
      const cartItemElement = document.createElement('div');
      cartItemElement.className = 'cart-item';
      cartItemElement.innerHTML = `
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${item.price.toFixed(2)}</div>
        </div>
        <div class="cart-item-quantity">
          <button class="decrease-quantity"><i class="fas fa-minus"></i></button>
          <span>${item.quantity}</span>
          <button class="increase-quantity"><i class="fas fa-plus"></i></button>
        </div>
        <button class="remove-item"><i class="fas fa-trash"></i></button>
      `;
      
      cartItemsContainer.appendChild(cartItemElement);
      
      // Add event listeners for quantity controls
      const decreaseBtn = cartItemElement.querySelector('.decrease-quantity');
      const increaseBtn = cartItemElement.querySelector('.increase-quantity');
      const removeBtn = cartItemElement.querySelector('.remove-item');
      const quantityDisplay = cartItemElement.querySelector('.cart-item-quantity span');
      
      decreaseBtn.addEventListener('click', () => {
        if (item.quantity > 1) {
          item.quantity -= 1;
          quantityDisplay.textContent = item.quantity;
        } else {
          cart = cart.filter(cartItem => cartItem.name !== item.name);
        }
        updateCart();
      });
      
      increaseBtn.addEventListener('click', () => {
        item.quantity += 1;
        quantityDisplay.textContent = item.quantity;
        updateCart();
      });
      
      removeBtn.addEventListener('click', () => {
        cart = cart.filter(cartItem => cartItem.name !== item.name);
        updateCart();
      });
    });
    
    // Update cart count and total
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = `(${itemCount})`;
    cartBadge.textContent = itemCount;
    totalAmount.textContent = `$${total.toFixed(2)}`;
  }
  
  // Cart sidebar controls
  cartBtn.addEventListener('click', () => {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('active');
  });
  
  closeCartBtn.addEventListener('click', () => {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('active');
  });
  
  cartOverlay.addEventListener('click', () => {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('active');
  });
  
  checkoutBtn.addEventListener('click', () => {
    alert('Order placed! Total: ' + totalAmount.textContent);
    cart = [];
    updateCart();
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('active');
  });

  // Search functionality
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    
    document.querySelectorAll('.item').forEach(item => {
      const itemName = item.querySelector('.item-name').textContent.toLowerCase();
      const itemDesc = item.querySelector('.item-desc')?.textContent.toLowerCase() || '';
      
      if (itemName.includes(searchTerm) || itemDesc.includes(searchTerm)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  });

  // Your existing navigation code
  const navButtons = document.querySelectorAll('.nav-btn');
  navButtons.forEach(button => {
    button.addEventListener('click', function() {
      const sectionId = this.getAttribute('data-section');
      showSection(sectionId, this);
    });
  });

  const foodNavButtons = document.querySelectorAll('.food-nav-btn');
  foodNavButtons.forEach(button => {
    button.addEventListener('click', function() {
      const subsectionId = this.getAttribute('data-subsection');
      showFoodSubSection(subsectionId, this);
    });
  });

  const beveragesNavButtons = document.querySelectorAll('.beverages-nav-btn');
  beveragesNavButtons.forEach(button => {
    button.addEventListener('click', function() {
      const subsectionId = this.getAttribute('data-subsection');
      showBeverageSubSection(subsectionId, this);
    });
  });
});

function showSection(sectionId, activeButton) {
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });
  
  document.getElementById(sectionId).classList.add('active');
  
  document.querySelectorAll('.nav-btn').forEach(button => {
    button.classList.remove('active');
  });
  
  if (activeButton) {
    activeButton.classList.add('active');
  }
  
  // Reset search when changing sections
  document.getElementById('search-input').value = '';
  document.querySelectorAll('.item').forEach(item => {
    item.style.display = 'flex';
  });
}

function showFoodSubSection(subsectionId, activeButton) {
  document.querySelectorAll('.food-sub-section').forEach(section => {
    section.classList.remove('active');
  });
  
  document.getElementById(subsectionId).classList.add('active');
  
  document.querySelectorAll('.food-nav-btn').forEach(button => {
    button.classList.remove('active');
  });
  
  if (activeButton) {
    activeButton.classList.add('active');
  }
}

function showBeverageSubSection(subsectionId, activeButton) {
  document.querySelectorAll('.beverage-sub-section').forEach(section => {
    section.classList.remove('active');
  });
  
  document.getElementById(subsectionId).classList.add('active');
  
  document.querySelectorAll('.beverages-nav-btn').forEach(button => {
    button.classList.remove('active');
  });
  
  if (activeButton) {
    activeButton.classList.add('active');
  }
}
