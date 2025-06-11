document.addEventListener('DOMContentLoaded', function() {
    // Category filtering
    const categoryButtons = document.querySelectorAll('.category-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
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
    
    let cart = [];
    
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
    
    cartToggle.addEventListener('click', () => toggleCart(true));
    closeCartBtn.addEventListener('click', () => toggleCart(false));
    cartOverlay.addEventListener('click', () => toggleCart(false));
    
    // Add to cart functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const menuItem = this.closest('.menu-item');
            const itemName = menuItem.querySelector('.item-name').textContent;
            const itemPrice = parseFloat(menuItem.querySelector('.item-price').textContent.replace('$', ''));
            
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
        });
    });
    
    function updateCart() {
    // Clear cart display
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
        cartBadge.style.display = 'none';
        cartTotal.textContent = '0.00';
        return;
    }
    
    // Add each item to cart display
    let total = 0;
    let itemCount = 0;
    
    cart.forEach((item, index) => {
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
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

    
    // Checkout button
    const checkoutButton = document.querySelector('.checkout-btn');
    
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
});
