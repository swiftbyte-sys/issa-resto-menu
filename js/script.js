document.addEventListener('DOMContentLoaded', function() {
    // Category filtering
    const categoryButtons = document.querySelectorAll('.category-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    
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
    
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    
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
    
    // Shopping cart functionality
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartBadge = document.getElementById('cart-badge');
    const cartToggle = document.querySelector('.cart-toggle');
    const cartSection = document.getElementById('cart-section');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCartBtn = document.querySelector('.close-cart');
    const checkoutButton = document.querySelector('.checkout-btn');
    
    // Special instructions modal elements
    const instructionsModal = document.getElementById('instructions-modal');
    const specialInstructions = document.getElementById('special-instructions');
    const closeModalBtn = document.querySelector('.close-modal');
    const submitInstructionsBtn = document.querySelector('.submit-instructions');
    
    // Feedback button
    const feedbackBtn = document.getElementById('feedback-btn');
    
    let cart = [];
    let currentItem = null;
    
    // Toggle cart visibility
    function toggleCart(show) {
        if (show) {
            cartSection.classList.add('visible');
            cartOverlay.classList.add('visible');
        } else {
            cartSection.classList.remove('visible');
            cartOverlay.classList.remove('visible');
        }
    }
    
    // Cart toggle event listeners
    cartToggle.addEventListener('click', () => toggleCart(true));
    closeCartBtn.addEventListener('click', () => toggleCart(false));
    cartOverlay.addEventListener('click', () => toggleCart(false));
    
    // Add to cart functionality with special instructions
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            currentItem = this.closest('.menu-item');
            instructionsModal.classList.add('visible');
            specialInstructions.focus();
        });
    });
    
    // Modal event listeners
    closeModalBtn.addEventListener('click', () => {
        instructionsModal.classList.remove('visible');
        specialInstructions.value = '';
    });
    
    submitInstructionsBtn.addEventListener('click', addItemToCart);
    
    // Handle Enter key in instructions textarea
    specialInstructions.addEventListener('keydown', function(e) {
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
        
        const existingItemIndex = cart.findIndex(item => 
            item.name === itemName && item.instructions === instructions
        );
        
        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push({
                name: itemName,
                price: itemPrice,
                quantity: 1,
                instructions: instructions
            });
        }
        
        updateCart();
        instructionsModal.classList.remove('visible');
        specialInstructions.value = '';
        currentItem = null;
    }
    
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
                        <button class="quantity-btn decrease" data-index="${index}">−</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn increase" data-index="${index}">+</button>
                    </div>
                    <button class="delete-item" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItemElement);
            
            total += item.price * item.quantity;
            itemCount += item.quantity;
        });
        
        // Add event listeners to quantity buttons
        document.querySelectorAll('.decrease').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                if (cart[index].quantity > 1) {
                    cart[index].quantity -= 1;
                } else {
                    cart.splice(index, 1);
                }
                updateCart();
            });
        });
        
        document.querySelectorAll('.increase').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                cart[index].quantity += 1;
                updateCart();
            });
        });
        
        document.querySelectorAll('.delete-item').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                cart.splice(index, 1);
                updateCart();
            });
        });
        
        cartBadge.textContent = itemCount;
        cartTotal.textContent = total.toFixed(2);
        cartBadge.style.display = 'flex';
    }
    
    // Checkout button
    checkoutButton.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
        } else {
            alert(`Order placed! Total: $${parseFloat(cartTotal.textContent).toFixed(2)}`);
            cart = [];
            updateCart();
            toggleCart(false);
        }
    });
    
    // Feedback button - redirect to feedback page
    feedbackBtn.addEventListener('click', () => {
        window.location.href = 'feedback.html';
    });
});
