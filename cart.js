function getCart() {
    const cartJson = localStorage.getItem('cart');
    return cartJson ? JSON.parse(cartJson) : [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function getCartCount() {
    return getCart().reduce((sum, item) => sum + (item.quantity || 0), 0);
}

function getCartTotal() {
    return getCart().reduce((sum, item) => {
        const price = parseFloat(item.price) || 0;
        const quantity = item.quantity || 0;
        return sum + price * quantity;
    }, 0);
}

function updateCartBadge() {
    const badgeTarget = document.querySelector('.cart-icon');
    if (!badgeTarget) return;
    const count = getCartCount();
    if (count > 0) {
        badgeTarget.setAttribute('data-count', count);
    } else {
        badgeTarget.removeAttribute('data-count');
    }
}

function showToast(message) {
    let toastRoot = document.getElementById('toast-root');
    if (!toastRoot) {
        toastRoot = document.createElement('div');
        toastRoot.id = 'toast-root';
        document.body.appendChild(toastRoot);
    }

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    toastRoot.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('visible');
    });

    setTimeout(() => {
        toast.classList.remove('visible');
        toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, 2300);
}

function addToCart(item) {
    const cart = getCart();
    const itemId = item.id || item.name;
    const existing = cart.find((x) => (x.id || x.name) === itemId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...item, id: itemId, quantity: 1 });
    }
    saveCart(cart);
    updateCartBadge();
    showToast(`"${item.name}" додано в кошик`);
}

function updateQuantity(id, delta) {
    let cart = getCart();
    const item = cart.find(x => x.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            cart = cart.filter(x => x.id !== id);
        }
        saveCart(cart);
        renderBasket();
    }
}

function removeItem(id) {
    let cart = getCart();
    cart = cart.filter(x => x.id !== id);
    saveCart(cart);
    renderBasket();
}

function renderBasket() {
    const cart = getCart();
    const content = document.getElementById('basket-content');
    if (!content) return;

    if (!cart.length) {
        content.innerHTML = `<div class="empty-msg"><h1>Ваш кошик порожній</h1><a href="index.html" class="btn-outline">Повернутися до меню</a></div>`;
        return;
    }

    let total = 0;
    const itemsHtml = cart.map(item => {
        const itemPrice = parseFloat(item.price) || 0;
        total += itemPrice * item.quantity;
        return `
            <div class="cart-item">
                <div class="item-info">
                    <div class="item-img-placeholder">Photo</div>
                    <div class="item-details">
                        <div class="item-name">${item.name}</div>
                        <div class="item-price-unit">${itemPrice} ₴</div>
                    </div>
                </div>
                <div class="item-controls">
                    <div class="quantity-picker">
                        <button onclick="updateQuantity('${item.id}', -1)">−</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity('${item.id}', 1)">+</button>
                    </div>
                    <div class="item-total-price">${itemPrice * item.quantity} ₴</div>
                    <button class="remove-btn" onclick="removeItem('${item.id}')">✕</button>
                </div>
            </div>
        `;
    }).join('');

    content.innerHTML = `
        <div class="cart-list">${itemsHtml}</div>
        <div class="total-section">
            <span>ВСЬОГО ДО ОПЛАТИ</span>
            <span class="total-amount">${total} ₴</span>
        </div>
        <div class="cart-actions">
            <a href="index.html" class="btn-outline">Продовжити вибір</a>
            <a href="delivery.html" class="btn-primary">Оформити замовлення</a>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    renderBasket();
    updateCartBadge();
});