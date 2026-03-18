let menuItems = [];

function renderMenu(items) {
    let container = document.getElementById('menu-grid');
    container.innerHTML = '';

    if (!items.length) {
        container.innerHTML = '<p style="color:white; text-align:center; width:100%;">Немає страв за вибраною категорією...</p>';
        return;
    }

    items.forEach(item => {
        let card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="photo-placeholder">Photo</div>
            <div class="card-info">
                <div class="row">
                    <h3>${item.name}</h3>
                    <span class="price">${item.price}</span>
                </div>
                <p class="description">${item.description}</p>
                <button class="add-btn">Додати до замовлення</button>
            </div>
        `;
        card.querySelector('.add-btn').addEventListener('click', () => addToCart(item));
        container.appendChild(card);
    });
}

function setActiveCategory(category) {
    let filterLinks = document.querySelectorAll('.filter a');
    filterLinks.forEach(link => {
        if (link.dataset.category === category) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    if (category === 'Усе') {
        renderMenu(menuItems);
    } else {
        renderMenu(menuItems.filter(i => i.category === category));
    }
}

function initCategoryFilters() {
    let filterLinks = document.querySelectorAll('.filter a');
    filterLinks.forEach(link => {
        let category = link.textContent.trim();
        link.dataset.category = category;
        link.addEventListener('click', event => {
            event.preventDefault();
            setActiveCategory(category);
        });
    });
}

async function loadMenu() {
    try {
        let response = await fetch('scr/menu.json');
        menuItems = await response.json();
        renderMenu(menuItems);
        initCategoryFilters();
        setActiveCategory('Усе');
    } catch (error) {
        console.error('Помилка завантаження меню:', error);
        let container = document.getElementById('menu-grid');
        container.innerHTML = '<p style="color:white;">Не вдалося завантажити меню...</p>';
    }
}

loadMenu();
