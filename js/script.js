document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const categoryButtons = document.querySelectorAll('.category-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    const searchInput = document.querySelector('.search-input');
    const cartToggle = document.querySelector('.cart-toggle');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartSection = document.getElementById('cart-section');
    const closeCart = document.querySelector('.close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartBadge = document.getElementById('cart-badge');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const feedbackBtn = document.getElementById('feedback-btn');
    const instructionsModal = document.getElementById('instructions-modal');
    const closeModal = document.querySelector('.close-modal');
    const submitInstructions = document.querySelector('.submit-instructions');
    
    // Cart state
    let cart = [];
    let currentItemToAdd = null;

    // Initialize the app
    function init() {
        setupEventListeners();
        updateCartBadge();
    }

    // Set up all event listeners
    function setupEventListeners() {
        // Category filter buttons
        categoryButtons.forEach(button => {
            button.addEventListener('click', filterByCategory);
        });

        // Search input
        searchInput.addEventListener('input', filterBySearch);

        // Cart toggle
        cartToggle.addEventListener('click', toggleCart);
        cartOverlay.addEventListener('click', toggleCart);
        closeCart.addEventListener('click', toggleCart);

        // Add to cart buttons - FIXED THIS SECTION
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const menuItem = this.closest('.menu-item');
                currentItemToAdd = {
                    id: menuItem.dataset.category + '-' + Math.random().toString(36).substr(2, 9),
                    name: menuItem.querySelector('.item-name').textContent,
                    price: parseFloat(menuItem.querySelector('.item-price').textContent.replace('$', '')),
                    category: menuItem.dataset.category,
                    instructions: ''
                };
                showInstructionsModal();
            });
        });

        // Feedback button
        feedbackBtn.addEventListener('click', function() {
            window.location.href = 'feedback.html';
        });

        // Modal controls
        closeModal.addEventListener('click', hideInstructionsModal);
        submitInstructions.addEventListener('click', addToCartWithInstructions);
        instructionsModal.addEventListener('click', function(e) {
            if (e.target === this) hideInstructionsModal();
        });
    }

    // Filter menu items by category
    function filterByCategory() {
        const category = this.dataset.category;
        
        // Update active button
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // Filter items
        menuItems.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // Filter menu items by search term
    function filterBySearch() {
        const searchTerm = this.value.toLowerCase();
        
        menuItems.forEach(item => {
            const name = item.querySelector('.item-name').textContent.toLowerCase();
            const description = item.querySelector('.item-description').textContent.toLowerCase();
            
            if (name.includes(searchTerm) || description.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // Toggle cart visibility
    function toggleCart() {
        cartOverlay.classList.toggle('visible');
        cartSection.classList.toggle('visible');
        
        if (cartSection.classList.contains('visible')) {
            renderCartItems();
        }
    }

    // Show instructions modal - FIXED THIS FUNCTION
    function showInstructionsModal() {
        document.getElementById('special-instructions').value = '';
        instructionsModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    // Hide instructions modal - FIXED THIS FUNCTION
    function hideInstructionsModal() {
        instructionsModal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    // Add item to cart with instructions - FIXED THIS FUNCTION
    function addToCartWithInstructions() {
        const instructions = document.getElementById('special-instructions').value;
        currentItemToAdd.instructions = instructions;
        
        // Check if item already exists in cart with same instructions
        const existingItemIndex = cart.findIndex(item => 
            item.name === currentItemToAdd.name && 
            item.instructions === currentItemToAdd.instructions
        );
        
        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            currentItemToAdd.quantity = 1;
            cart.push(currentItemToAdd);
        }
        
        updateCartBadge();
        hideInstructionsModal();
        
        if (cartSection.classList.contains('visible')) {
            renderCartItems();
        }
    }

    // Render cart items
    function renderCartItems() {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
            cartTotal.textContent = '0.00';
            return;
        }
        
        let total = 0;
        cartItemsContainer.innerHTML = '';
        
        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                    ${item.instructions ? `<div class="cart-item-instructions">${item.instructions}</div>` : ''}
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" data-index="${index}">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn plus" data-index="${index}">+</button>
                    </div>
                </div>
                <button class="delete-item" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            
            cartItemsContainer.appendChild(cartItemElement);
        });
        
        // Add event listeners to quantity buttons
        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', decreaseQuantity);
        });
        
        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', increaseQuantity);
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-item').forEach(btn => {
            btn.addEventListener('click', removeItem);
        });
        
        cartTotal.textContent = total.toFixed(2);
    }

    // Decrease item quantity
    function decreaseQuantity() {
        const index = parseInt(this.dataset.index);
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
        } else {
            cart.splice(index, 1);
        }
        updateCartBadge();
        renderCartItems();
    }

    // Increase item quantity
    function increaseQuantity() {
        const index = parseInt(this.dataset.index);
        cart[index].quantity += 1;
        updateCartBadge();
        renderCartItems();
    }

    // Remove item from cart
    function removeItem() {
        const index = parseInt(this.dataset.index);
        cart.splice(index, 1);
        updateCartBadge();
        renderCartItems();
    }

    // Update cart badge with total quantity
    function updateCartBadge() {
        const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
        cartBadge.textContent = totalQuantity;
        cartBadge.style.display = totalQuantity > 0 ? 'flex' : 'none';
    }

    // Checkout button handler
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        alert(`Order placed! Total: $${parseFloat(cartTotal.textContent).toFixed(2)}\nThank you for your order!`);
        cart = [];
        updateCartBadge();
        renderCartItems();
        toggleCart();
    });

    // Initialize the app
    init();
});
