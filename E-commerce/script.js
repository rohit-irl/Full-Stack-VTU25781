// ============================================
// SHOPHUB - Enhanced E-Commerce Website
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
        category: 'audio',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
        description: 'High-quality sound with active noise cancellation',
        featured: true,
        reviews: [
            { user: 'John', rating: 5, text: 'Best headphones ever!' }
        ]
    },
    {
        id: 2,
        name: 'Smartwatch Pro',
        price: 15999,
        category: 'wearable',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
        description: 'Track fitness, sleep, and receive notifications',
        featured: true,
        reviews: []
    },
    {
        id: 3,
        name: 'Portable Phone Charger',
        price: 1299,
        category: 'accessories',
        image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop',
        description: '20000mAh capacity with fast charging support',
        featured: false,
        reviews: []
    },
    {
        id: 4,
        name: 'USB-C Charging Cable',
        price: 499,
        category: 'accessories',
        image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400&h=400&fit=crop',
        description: 'Durable braided cable, 2m length',
        featured: false,
        reviews: []
    },
    {
        id: 5,
        name: 'Bluetooth Speaker',
        price: 3499,
        category: 'audio',
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
        description: 'Waterproof, 360° surround sound',
        featured: true,
        reviews: []
    },
    {
        id: 6,
        name: 'Tablet Stand',
        price: 799,
        category: 'accessories',
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
        description: 'Adjustable aluminum stand for all tablets',
        featured: false,
        reviews: []
    },
    {
        id: 7,
        name: 'Webcam 4K',
        price: 8999,
        category: 'peripherals',
        image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop',
        description: 'Ultra HD video recording with built-in microphone',
        featured: false,
        reviews: []
    },
    {
        id: 8,
        name: 'Wireless Mouse',
        price: 1999,
        category: 'peripherals',
        image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop',
        description: 'Ergonomic design with silent clicking',
        featured: true,
        reviews: []
    },
    {
        id: 9,
        name: 'Mechanical Keyboard RGB',
        price: 7999,
        category: 'peripherals',
        image: 'https://images.unsplash.com/photo-1587829191301-2ec6d4aaa56f?w=400&h=400&fit=crop',
        description: 'Cherry MX switches with RGB backlighting',
        featured: false,
        reviews: []
    },
    {
        id: 10,
        name: 'USB Hub 7-in-1',
        price: 1499,
        category: 'accessories',
        image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400&h=400&fit=crop',
        description: 'Multiple ports for expanded connectivity',
        featured: false,
        reviews: []
    },
    {
        id: 11,
        name: 'Laptop Stand Pro',
        price: 2499,
        category: 'accessories',
        image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400&h=400&fit=crop',
        description: 'Adjustable height for ergonomic workspace',
        featured: false,
        reviews: []
    },
    {
        id: 12,
        name: 'Screen Protector (Glass)',
        price: 399,
        category: 'accessories',
        image: 'https://images.unsplash.com/photo-1581822261290-991b38693d1b?w=400&h=400&fit=crop',
        description: 'Tempered glass for ultimate protection',
        featured: false,
        reviews: []
    }
];

// ============================================
// 2. STATE MANAGEMENT
// ============================================

let cart = [];
let filteredProducts = [...products];
let currentProduct = null;

// Load cart from localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('shopHub_cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
        } catch (e) {
            console.error('Error loading cart:', e);
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

const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-link');
const searchInput = document.getElementById('search-input');
const productsGrid = document.getElementById('products-grid');
const noProductsMsg = document.getElementById('no-products-msg');
const cartCountBadge = document.querySelector('.cart-count');
const categoryFilter = document.getElementById('category-filter');
const sortSelect = document.getElementById('sort-select');
const resetFiltersBtn = document.getElementById('reset-filters-btn');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navMenu = document.getElementById('nav-menu');

// ============================================
// 4. PAGE NAVIGATION
// ============================================

function showPage(pageName) {
    pages.forEach(page => page.classList.remove('active'));
    navLinks.forEach(link => link.classList.remove('active'));

    const page = document.getElementById(`${pageName}-page`);
    if (page) {
        page.classList.add('active');
    }

    const link = document.querySelector(`[data-page="${pageName}"]`);
    if (link) {
        link.classList.add('active');
    }

    // Render cart when navigating to cart page
    if (pageName === 'cart') {
        renderCart();
    }

    window.scrollTo(0, 0);
    navMenu.classList.remove('active');
}

// ============================================
// 5. PRODUCT RENDERING
// ============================================

function renderProducts(productsToRender) {
    productsGrid.innerHTML = '';

    if (productsToRender.length === 0) {
        noProductsMsg.style.display = 'block';
        productsGrid.style.display = 'none';
        return;
    }

    noProductsMsg.style.display = 'none';
    productsGrid.style.display = 'grid';

    productsToRender.forEach(product => {
        const card = createProductCard(product);
        productsGrid.appendChild(card);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';

    let badge = '';
    if (product.featured) {
        badge = '<span style="position: absolute; top: 10px; right: 10px; background: var(--secondary-color); color: white; padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.75rem;">🔥 Featured</span>';
    }

    card.innerHTML = `
        <div style="position: relative;">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            ${badge}
        </div>
        <div class="product-info">
            <h3 class="product-name">${escapeHtml(product.name)}</h3>
            <p class="product-description">${escapeHtml(product.description)}</p>
            <div class="product-price">₹${product.price.toLocaleString('en-IN')}</div>
            <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                <button class="btn btn-primary" style="flex: 1;" onclick="viewProductDetails(${product.id})">View Details</button>
                <button class="btn btn-primary" style="flex: 1;" onclick="addToCart(${product.id}, 1)">Add to Cart</button>
            </div>
        </div>
    `;

    return card;
}

// ============================================
// 6. FEATURED PRODUCTS (HOME PAGE)
// ============================================

function renderFeaturedProducts() {
    const featured = products.filter(p => p.featured);
    const featuredGrid = document.getElementById('featured-products');
    
    if (featuredGrid) {
        featuredGrid.innerHTML = '';
        featured.forEach(product => {
            const card = createProductCard(product);
            featuredGrid.appendChild(card);
        });
    }
}

// ============================================
// 7. PRODUCT DETAILS PAGE
// ============================================

function viewProductDetails(productId) {
    currentProduct = products.find(p => p.id === productId);
    if (currentProduct) {
        renderProductDetails();
        showPage('product-details');
    }
}

function renderProductDetails() {
    const container = document.getElementById('product-details-container');
    const product = currentProduct;

    let reviewsHtml = '<div class="product-reviews"><h3>Customer Reviews</h3>';
    if (product.reviews.length > 0) {
        product.reviews.forEach(review => {
            reviewsHtml += `
                <div class="review-item">
                    <div class="review-author">⭐ ${review.rating}/5 - ${review.user}</div>
                    <div class="review-text">${review.text}</div>
                </div>
            `;
        });
    } else {
        reviewsHtml += '<p style="color: var(--text-secondary);">No reviews yet. Be the first to review!</p>';
    }
    reviewsHtml += '</div>';

    container.innerHTML = `
        <div class="product-details-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-details-info">
            <h1>${escapeHtml(product.name)}</h1>
            <div class="product-details-price">₹${product.price.toLocaleString('en-IN')}</div>
            <p>${escapeHtml(product.description)}</p>
            <div style="margin: 2rem 0;">
                <label>Quantity:</label>
                <input type="number" id="detail-qty" value="1" min="1" max="99" style="width: 80px; padding: 0.5rem; border: 2px solid var(--border-color); border-radius: 0.375rem;">
            </div>
            <button class="btn btn-success" style="width: 100%; padding: 1rem;" onclick="addDetailToCart()">Add to Cart</button>
            ${reviewsHtml}
        </div>
    `;
}

function addDetailToCart() {
    const qty = parseInt(document.getElementById('detail-qty').value);
    if (qty >= 1 && currentProduct) {
        addToCart(currentProduct.id, qty);
        alert('✓ Added to cart!');
    }
}

// ============================================
// 8. CART FUNCTIONS
// ============================================

function addToCart(productId, quantity = 1) {
    if (quantity < 1) return;

    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
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

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    renderCart();
    updateCartCount();
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1 || newQuantity > 99) return;

    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCartToStorage();
        renderCart();
    }
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountBadge.textContent = totalItems;
}

// ============================================
// 9. CART RENDERING
// ============================================

function renderCart() {
    const cartItemsDiv = document.getElementById('cart-items');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const emptyCartMsg = document.getElementById('empty-cart-msg');

    cartItemsDiv.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.style.display = 'none';
        emptyCartMsg.style.display = 'block';
        return;
    }

    cartItemsContainer.style.display = 'grid';
    emptyCartMsg.style.display = 'none';

    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        const subtotal = item.price * item.quantity;

        itemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <div class="cart-item-name">${escapeHtml(item.name)}</div>
                <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</div>
                <div class="cart-item-controls">
                    <div class="qty-control">
                        <button class="qty-btn qty-decrease" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">−</button>
                        <div class="qty-display">${item.quantity}</div>
                        <button class="qty-btn qty-increase" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                    <div class="cart-item-subtotal">
                        <div class="subtotal-label">Subtotal</div>
                        <div class="subtotal-amount">₹${subtotal.toLocaleString('en-IN')}</div>
                    </div>
                </div>
            </div>
            <button class="btn btn-danger remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        `;

        cartItemsDiv.appendChild(itemDiv);
    });

    updateCartSummary();
}

function updateCartSummary() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.1 * 100) / 100;
    const total = subtotal + tax;

    document.getElementById('total-items').textContent = totalItems;
    document.getElementById('subtotal').textContent = `₹${subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    document.getElementById('tax').textContent = `₹${tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    document.getElementById('total-amount').textContent = `₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
}

// ============================================
// 10. FILTERING & SORTING
// ============================================

function applyFiltersAndSort() {
    let result = [...products];

    // Search filter
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (searchTerm) {
        result = result.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm)
        );
    }

    // Category filter
    const category = categoryFilter.value;
    if (category) {
        result = result.filter(p => p.category === category);
    }

    // Sorting
    const sortBy = sortSelect.value;
    switch(sortBy) {
        case 'price-low':
            result.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            result.sort((a, b) => b.price - a.price);
            break;
        case 'new':
            result.reverse();
            break;
        case 'featured':
        default:
            result.sort((a, b) => b.featured - a.featured);
    }

    filteredProducts = result;
    renderProducts(filteredProducts);
}

function resetFilters() {
    searchInput.value = '';
    categoryFilter.value = '';
    sortSelect.value = 'featured';
    applyFiltersAndSort();
}

// ============================================
// 11. CHECKOUT
// ============================================

function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    // Populate checkout summary
    const checkoutItems = document.getElementById('checkout-items');
    checkoutItems.innerHTML = cart.map(item => 
        `<div style="display: flex; justify-content: space-between; padding: 0.5rem 0;">
            <span>${escapeHtml(item.name)} x ${item.quantity}</span>
            <span>₹${(item.price * item.quantity).toLocaleString('en-IN')}</span>
        </div>`
    ).join('');

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.1 * 100) / 100;

    document.getElementById('checkout-subtotal').textContent = `₹${subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    document.getElementById('checkout-tax').textContent = `₹${tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    document.getElementById('checkout-total').textContent = `₹${(subtotal + tax).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

    showPage('checkout');
}

function placeOrder(e) {
    e.preventDefault();

    const name = document.getElementById('cust-name').value;
    const email = document.getElementById('cust-email').value;

    if (!name || !email) {
        alert('Please fill all required fields');
        return;
    }

    // Generate order ID
    const orderId = 'ORD' + Date.now();
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = Math.round(total * 0.1 * 100) / 100;
    const finalTotal = total + tax;

    // Calculate delivery date
    const delivery = new Date();
    delivery.setDate(delivery.getDate() + 5);
    const deliveryDate = delivery.toLocaleDateString('en-IN');

    // Show confirmation
    document.getElementById('order-id').textContent = orderId;
    document.getElementById('order-total').textContent = `₹${finalTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    document.getElementById('order-delivery').textContent = deliveryDate;

    // Clear cart and show confirmation
    cart = [];
    saveCartToStorage();
    updateCartCount();

    showPage('order-confirmation');
}

// ============================================
// 12. CONTACT FORM
// ============================================

function handleContactForm(e) {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    document.getElementById('contact-form').reset();
}

// ============================================
// 13. UTILITY FUNCTIONS
// ============================================

function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ============================================
// 14. EVENT LISTENERS
// ============================================

// Page navigation
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        showPage(page);
    });
});

// Footer links
document.querySelectorAll('.footer-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        showPage(page);
    });
});

// Shop button on home
document.getElementById('shop-btn')?.addEventListener('click', () => showPage('products'));

// Filters
searchInput?.addEventListener('input', applyFiltersAndSort);
categoryFilter?.addEventListener('change', applyFiltersAndSort);
sortSelect?.addEventListener('change', applyFiltersAndSort);
resetFiltersBtn?.addEventListener('click', resetFilters);

// Backend buttons
document.getElementById('back-btn')?.addEventListener('click', () => showPage('products'));
document.getElementById('continue-shopping-btn')?.addEventListener('click', () => showPage('products'));
document.getElementById('checkout-btn')?.addEventListener('click', proceedToCheckout);
document.getElementById('back-to-cart-btn')?.addEventListener('click', () => showPage('cart'));
document.getElementById('go-home-btn')?.addEventListener('click', () => showPage('home'));

// Checkout form
document.getElementById('checkout-form')?.addEventListener('submit', placeOrder);

// Contact form
document.getElementById('contact-form')?.addEventListener('submit', handleContactForm);

// Mobile menu
mobileMenuBtn?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// ============================================
// 15. INITIALIZATION
// ============================================

function init() {
    loadCartFromStorage();
    renderFeaturedProducts();
    renderProducts(products);
    showPage('home');
    console.log('ShopHub Enhanced initialized');
}

document.addEventListener('DOMContentLoaded', init);
