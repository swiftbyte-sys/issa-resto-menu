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
    const cartSection = document.querySelector('.cart-section');
    const closeCartBtn = document.querySelector('.close-cart');
    
    let cart = [];
    
    // Toggle cart visibility
    cartToggle.addEventListener('click', () => {
        cartSection.classList.add('visible');
    });
    
    closeCartBtn.addEventListener('click', () => {
        cartSection.classList.remove('visible');
    });
    
    // Add to cart functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const menuItem = button.closest('.menu-item');
            const itemName = menuItem.querySelector('.item-name').textContent;
            const itemPrice = parseFloat(menuItem.querySelector('.item-price').textContent.replace('$', ''));
            
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
            // Removed auto-showing cart when adding items
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
                    <div class="cart-item-name">${item.name} x${item.quantity}</div>
                    <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                </div>
                <div class="cart-item-actions">
                    <button class="delete-item" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItemElement);
            
            total += item.price * item.quantity;
            itemCount += item.quantity;
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                cart.splice(index, 1);
                updateCart();
            });
        });
        
        // Update cart badge and total
        cartBadge.textContent = itemCount;
        cartTotal.textContent = total.toFixed(2);
        cartBadge.style.display = 'flex';
    }
    
    // Checkout button
    const checkoutButton = document.querySelector('.checkout-btn');
    
    checkoutButton.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
        } else {
            alert(`Order placed! Total: $${parseFloat(cartTotal.textContent).toFixed(2)}`);
            cart = [];
            updateCart();
            cartSection.classList.remove('visible');
        }
    });
});
