document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart
    let cart = [];
    let currentItem = null;
    
    // DOM Elements
    const cartToggle = document.querySelector('.cart-toggle');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartSection = document.getElementById('cart-section');
    const closeCart = document.querySelector('.close-cart');
    
    // Add to cart functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const menuItem = this.closest('.menu-item');
            currentItem = {
                id: Date.now().toString(),
                name: menuItem.querySelector('.item-name').textContent,
                price: parseFloat(menuItem.querySelector('.item-price').textContent.replace('$', '')),
                category: menuItem.dataset.category,
                instructions: '',
                quantity: 1
            };
            
            // Show instructions modal
            document.getElementById('instructions-modal').style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Submit instructions
    document.querySelector('.submit-instructions').addEventListener('click', function(e) {
        e.preventDefault();
        
        const instructions = document.getElementById('special-instructions').value;
        currentItem.instructions = instructions;
        
        // Check if item already exists in cart
        const existingItem = cart.find(item => 
            item.name === currentItem.name && 
            item.instructions === currentItem.instructions
        );
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push(currentItem);
        }
        
        updateCartBadge();
        document.getElementById('instructions-modal').style.display = 'none';
        document.body.style.overflow = '';
    });
    
    // Cart toggle functionality
    cartToggle.addEventListener('click', function() {
        cartOverlay.style.display = 'block';
        cartSection.style.display = 'flex';
        setTimeout(() => {
            cartSection.classList.add('visible');
        }, 10);
        document.body.style.overflow = 'hidden';
        renderCartItems();
    });
    
    // Close cart
    function closeCartFn() {
        cartSection.classList.remove('visible');
        setTimeout(() => {
            cartOverlay.style.display = 'none';
            cartSection.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }
    
    closeCart.addEventListener('click', closeCartFn);
    cartOverlay.addEventListener('click', closeCartFn);
    
    // Close instructions modal
    document.querySelector('.close-modal').addEventListener('click', function() {
        document.getElementById('instructions-modal').style.display = 'none';
        document.body.style.overflow = '';
    });
    
    // Close instructions modal when clicking outside
    document.getElementById('instructions-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
    
    // Update cart badge
    function updateCartBadge() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        const cartBadge = document.getElementById('cart-badge');
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    // Render cart items
    function renderCartItems() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
            cartTotal.textContent = '0.00';
            return;
        }
        
        cartItemsContainer.innerHTML = '';
        let total = 0;
        
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
        
        cartTotal.textContent = total.toFixed(2);
        
        // Add event listeners to new buttons
        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                if (cart[index].quantity > 1) {
                    cart[index].quantity -= 1;
                } else {
                    cart.splice(index, 1);
                }
                updateCartBadge();
                renderCartItems();
            });
        });
        
        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                cart[index].quantity += 1;
                updateCartBadge();
                renderCartItems();
            });
        });
        
        document.querySelectorAll('.delete-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                cart.splice(index, 1);
                updateCartBadge();
                renderCartItems();
            });
        });
    }
    
    // Checkout button
    document.querySelector('.checkout-btn').addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        alert(`Order placed! Total: $${document.getElementById('cart-total').textContent}\nThank you for your order!`);
        cart = [];
        updateCartBadge();
        renderCartItems();
        closeCartFn();
    });
    
    // Feedback button
    document.getElementById('feedback-btn').addEventListener('click', function() {
        window.location.href = 'feedback.html';
    });
    
    // Category filtering
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Update active button
            document.querySelectorAll('.category-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // Filter items
            document.querySelectorAll('.menu-item').forEach(item => {
                if (category === 'all' || item.dataset.category === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Search functionality
    document.querySelector('.search-input').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        document.querySelectorAll('.menu-item').forEach(item => {
            const name = item.querySelector('.item-name').textContent.toLowerCase();
            const description = item.querySelector('.item-description').textContent.toLowerCase();
            
            if (name.includes(searchTerm) || description.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});
