document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const instructionsModal = document.getElementById('instructions-modal');
    const closeModal = document.querySelector('.close-modal');
    const submitInstructions = document.querySelector('.submit-instructions');
    const cartBadge = document.getElementById('cart-badge');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    // Cart state
    let cart = [];
    let currentItem = null;

    // Add to cart button click handler
    addToCartButtons.forEach(button => {
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
            
            showModal();
        });
    });

    // Show modal function
    function showModal() {
        document.getElementById('special-instructions').value = '';
        instructionsModal.classList.add('visible');
        document.body.style.overflow = 'hidden';
    }

    // Hide modal function
    function hideModal() {
        instructionsModal.classList.remove('visible');
        document.body.style.overflow = '';
    }

    // Close modal when clicking X or overlay
    closeModal.addEventListener('click', hideModal);
    instructionsModal.addEventListener('click', function(e) {
        if (e.target === this) hideModal();
    });

    // Submit instructions and add to cart
    submitInstructions.addEventListener('click', function(e) {
        e.preventDefault();
        const instructions = document.getElementById('special-instructions').value;
        
        if (currentItem) {
            currentItem.instructions = instructions;
            
            // Check if item already exists in cart
            const existingItemIndex = cart.findIndex(item => 
                item.name === currentItem.name && 
                item.instructions === currentItem.instructions
            );
            
            if (existingItemIndex !== -1) {
                cart[existingItemIndex].quantity += 1;
            } else {
                cart.push(currentItem);
            }
            
            updateCart();
            hideModal();
        }
    });

    // Update cart UI
    function updateCart() {
        // Update badge
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
        
        // Update cart items list
        renderCartItems();
    }

    // Render cart items
    function renderCartItems() {
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
                updateCart();
            });
        });
        
        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                cart[index].quantity += 1;
                updateCart();
            });
        });
        
        document.querySelectorAll('.delete-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                cart.splice(index, 1);
                updateCart();
            });
        });
    }
});
