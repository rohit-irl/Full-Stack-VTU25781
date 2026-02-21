// ============================================
// SHOPHUB - Mini E-Commerce Website
// Vanilla JavaScript | No Frameworks
// ============================================

// ============================================
// 1. PRODUCTS DATA
// ============================================

const products = [
    {
        id: 1,
        name: 'Premium Wireless Headphones',
        price: 4999,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
        description: 'High-quality sound with active noise cancellation'
    },
    {
        id: 2,
        name: 'Smartwatch Pro',
        price: 15999,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
        description: 'Track fitness, sleep, and receive notifications'
    },
    {
        id: 3,
        name: 'Portable Phone Charger',
        price: 1299,
        image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop',
        description: '20000mAh capacity with fast charging support'
    },
    {
        id: 4,
        name: 'USB-C Charging Cable',
        price: 499,
        image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400&h=400&fit=crop',
        description: 'Durable braided cable, 2m length'
    },
    {
        id: 5,
        name: 'Bluetooth Speaker',
        price: 3499,
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
        description: 'Waterproof, 360° surround sound'
    },
    {
        id: 6,
        name: 'Tablet Stand',
        price: 799,
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
        description: 'Adjustable aluminum stand for all tablets'
    },
    {
        id: 7,
        name: 'Webcam 4K',
        price: 8999,
        image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop',
        description: 'Ultra HD video recording with built-in microphone'
    },
    {
        id: 8,
        name: 'Wireless Mouse',
        price: 1999,
        image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop',
        description: 'Ergonomic design with silent clicking'
    },
    {
        id: 9,
        name: 'Mechanical Keyboard RGB',
        price: 7999,
        image: 'https://images.unsplash.com/photo-1587829191301-2ec6d4aaa56f?w=400&h=400&fit=crop',
        description: 'Cherry MX switches with RGB backlighting'
    },
    {
        id: 10,
        name: 'USB Hub 7-in-1',
        price: 1499,
        image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400&h=400&fit=crop',
        description: 'Multiple ports for expanded connectivity'
    },
    {
        id: 11,
        name: 'Laptop Stand Pro',
        price: 2499,
        image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400&h=400&fit=crop',
        description: 'Adjustable height for ergonomic workspace'
    },
    {
        id: 12,
        name: 'Screen Protector (Glass)',
        price: 399,
        image: 'https://images.unsplash.com/photo-1581822261290-991b38693d1b?w=400&h=400&fit=crop',
        description: 'Tempered glass for ultimate protection'
    }
];

// ============================================
// 2. STATE MANAGEMENT
// ============================================

let cart = [];
let filteredProducts = [...products];

// Load cart from localStorage on page load
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('shopHub_cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
        } catch (e) {
            console.error('Error loading cart from storage:', e);
            cart = [];
        }
    }
    updateCartCount();
}

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('shopHub_cart', JSON.stringify(cart));
}

// ============================================
// 3. DOM ELEMENTS REFERENCES
// ============================================

const productsGrid = document.getElementById('products-grid');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartItemsDiv = document.getElementById('cart-items');
const searchInput = document.getElementById('search-input');
const noProductsMsg = document.getElementById('no-products-msg');
const emptyCartMsg = document.getElementById('empty-cart-msg');
const navBtns = document.querySelectorAll('.nav-btn');
const pages = document.querySelectorAll('.page');
const cartCountBadge = document.querySelector('.cart-count');
const continueShoppingBtn = document.getElementById('continue-shopping-btn');
const checkoutBtn = document.getElementById('checkout-btn');

// ============================================
// 4. RENDER PRODUCTS
// ============================================

/**
 * Renders products to the DOM
 * @param {Array} productsToRender - Array of products to display
 */
function renderProducts(productsToRender) {
    // Clear previous products
    productsGrid.innerHTML = '';

    if (productsToRender.length === 0) {
        noProductsMsg.style.display = 'block';
        productsGrid.style.display = 'none';
        return;
    }

    noProductsMsg.style.display = 'none';
    productsGrid.style.display = 'grid';

    // Create product cards
    productsToRender.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

/**
 * Creates a single product card element
 * @param {Object} product - Product object
 * @returns {HTMLElement} Product card element
 */
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.productId = product.id;

    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.className = 'quantity-input';
    quantityInput.value = '1';
    quantityInput.min = '1';
    quantityInput.max = '99';

    // Validate quantity input
    quantityInput.addEventListener('change', () => {
        let value = parseInt(quantityInput.value);
        if (isNaN(value) || value < 1) {
            quantityInput.value = '1';
        } else if (value > 99) {
            quantityInput.value = '99';
        }
    });

    const addToCartBtn = document.createElement('button');
    addToCartBtn.className = 'btn btn-primary btn-small';
    addToCartBtn.textContent = 'Add to Cart';
    addToCartBtn.addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value);
        if (quantity >= 1) {
            addToCart(product.id, quantity);
            // Visual feedback
            addToCartBtn.textContent = '✓ Added';
            setTimeout(() => {
                addToCartBtn.textContent = 'Add to Cart';
            }, 1500);
        }
    });

    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <h3 class="product-name">${escapeHtml(product.name)}</h3>
            <p class="product-description">${escapeHtml(product.description)}</p>
            <div class="product-price">₹${product.price.toLocaleString('en-IN')}</div>
        </div>
        <div class="product-controls"></div>
    `;

    const controls = card.querySelector('.product-controls');
    controls.appendChild(quantityInput);
    controls.appendChild(addToCartBtn);

    return card;
}

// ============================================
// 5. CART FUNCTIONS
// ============================================

/**
 * Add product to cart or increase quantity if exists
 * @param {number} productId - ID of product to add
 * @param {number} quantity - Quantity to add
 */
function addToCart(productId, quantity = 1) {
    // Validation
    if (quantity < 1) return;

    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        // Increase quantity instead of adding duplicate
        existingItem.quantity += quantity;
    } else {
        // Add new item to cart
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }

    saveCartToStorage();
    updateCartCount();
}

/**
 * Remove product from cart
 * @param {number} productId - ID of product to remove
 */
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    renderCart();
    updateCartCount();
}

/**
 * Update quantity of item in cart
 * @param {number} productId - ID of product
 * @param {number} newQuantity - New quantity value
 */
function updateQuantity(productId, newQuantity) {
    // Validation
    if (newQuantity < 1) return;
    if (newQuantity > 99) return;

    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCartToStorage();
        renderCart();
    }
}

/**
 * Update cart count badge
 */
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountBadge.textContent = totalItems;
}

// ============================================
// 6. RENDER CART
// ============================================

/**
 * Renders cart items to the DOM
 */
function renderCart() {
    // Clear previous items
    cartItemsDiv.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.style.display = 'none';
        emptyCartMsg.style.display = 'block';
        return;
    }

    cartItemsContainer.style.display = 'grid';
    emptyCartMsg.style.display = 'none';

    // Render each cart item
    cart.forEach(item => {
        const cartItem = createCartItemElement(item);
        cartItemsDiv.appendChild(cartItem);
    });

    // Update summary
    updateCartSummary();
}

/**
 * Creates a single cart item element
 * @param {Object} item - Cart item object
 * @returns {HTMLElement} Cart item element
 */
function createCartItemElement(item) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    itemDiv.dataset.productId = item.id;

    const subtotal = item.price * item.quantity;

    itemDiv.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-details">
            <div class="cart-item-name">${escapeHtml(item.name)}</div>
            <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</div>
            <div class="cart-item-controls">
                <div class="qty-control">
                    <button class="qty-btn qty-decrease">−</button>
                    <div class="qty-display">${item.quantity}</div>
                    <button class="qty-btn qty-increase">+</button>
                </div>
                <div class="cart-item-subtotal">
                    <div class="subtotal-label">Subtotal</div>
                    <div class="subtotal-amount">₹${subtotal.toLocaleString('en-IN')}</div>
                </div>
            </div>
        </div>
        <button class="btn btn-danger remove-btn">Remove</button>
    `;

    // Event listeners
    const decreaseBtn = itemDiv.querySelector('.qty-decrease');
    const increaseBtn = itemDiv.querySelector('.qty-increase');
    const removeBtn = itemDiv.querySelector('.remove-btn');

    decreaseBtn.addEventListener('click', () => {
        if (item.quantity > 1) {
            updateQuantity(item.id, item.quantity - 1);
        }
    });

    increaseBtn.addEventListener('click', () => {
        if (item.quantity < 99) {
            updateQuantity(item.id, item.quantity + 1);
        }
    });

    removeBtn.addEventListener('click', () => {
        removeFromCart(item.id);
    });

    return itemDiv;
}

/**
 * Update cart summary (totals)
 */
function updateCartSummary() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.1 * 100) / 100;
    const total = subtotal + tax;

    document.getElementById('total-items').textContent = totalItems;
    document.getElementById('subtotal').textContent = `₹${subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('tax').textContent = `₹${tax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('total-amount').textContent = `₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ============================================
// 7. PAGE NAVIGATION
// ============================================

/**
 * Show specific page and hide others
 * @param {string} pageName - Name of page to show ('products' or 'cart')
 */
function showPage(pageName) {
    // Hide all pages
    pages.forEach(page => page.classList.remove('active'));

    // Remove active class from all nav buttons
    navBtns.forEach(btn => btn.classList.remove('active'));

    // Show selected page
    if (pageName === 'products') {
        document.getElementById('products-page').classList.add('active');
    } else if (pageName === 'cart') {
        document.getElementById('cart-page').classList.add('active');
        renderCart();
    }

    // Add active class to clicked button
    document.querySelector(`[data-page="${pageName}"]`).classList.add('active');

    // Scroll to top
    window.scrollTo(0, 0);
}

// ============================================
// 8. SEARCH FUNCTIONALITY
// ============================================

/**
 * Filter products based on search term
 * @param {string} searchTerm - Search term
 */
function filterProducts(searchTerm) {
    const lowerSearchTerm = searchTerm.toLowerCase().trim();

    if (lowerSearchTerm === '') {
        filteredProducts = [...products];
    } else {
        filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(lowerSearchTerm) ||
            product.description.toLowerCase().includes(lowerSearchTerm)
        );
    }

    renderProducts(filteredProducts);
}

// ============================================
// 9. UTILITY FUNCTIONS
// ============================================

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ============================================
// 10. EVENT LISTENERS
// ============================================

// Navigation buttons
navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const page = btn.dataset.page;
        showPage(page);
    });
});

// Search input
searchInput.addEventListener('input', (e) => {
    filterProducts(e.target.value);
});

// Continue shopping button
continueShoppingBtn.addEventListener('click', () => {
    showPage('products');
});

// Checkout button
checkoutBtn.addEventListener('click', () => {
    if (cart.length > 0) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = Math.round(total * 0.1 * 100) / 100;
        const finalTotal = total + tax;

        alert(
            `Order Summary:\n\n` +
            `Total Items: ${cart.reduce((sum, item) => sum + item.quantity, 0)}\n` +
            `Subtotal: ₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}\n` +
            `Tax (10%): ₹${tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}\n` +
            `Final Amount: ₹${finalTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}\n\n` +
            `Thank you for your purchase!`
        );

        // Clear cart after checkout
        cart = [];
        saveCartToStorage();
        updateCartCount();
        showPage('products');
        searchInput.value = '';
        filterProducts('');
    }
});

// ============================================
// 11. INITIALIZATION
// ============================================

/**
 * Initialize the application
 */
function init() {
    // Load cart from storage
    loadCartFromStorage();

    // Render initial products
    renderProducts(products);

    // Show products page by default
    showPage('products');

    console.log('ShopHub E-Commerce initialized successfully');
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Prevent form submission on Enter in search
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
    }
});
