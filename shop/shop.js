let cart = [];
let cartTimeout;

function filterProducts(category) {
    document.querySelectorAll('.product-card').forEach(product => {
        if (category === 'all' || product.getAttribute('data-category') === category) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

function sortProducts(order) {
    const products = Array.from(document.querySelectorAll('.product-card'));
    products.sort((a, b) => {
        const priceA = parseFloat(a.getAttribute('data-price'));
        const priceB = parseFloat(b.getAttribute('data-price'));
        if (order === 'price-asc') {
            return priceA - priceB;
        } else if (order === 'price-desc') {
            return priceB - priceA;
        } else if (order === 'name') {
            return a.getAttribute('data-name').localeCompare(b.getAttribute('data-name'));
        }
        return 0;
    });
    const container = document.getElementById('product-container');
    products.forEach(product => container.appendChild(product));
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    let totalAmount = 0;
    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`;
        cartItems.appendChild(li);
        totalAmount += item.price * item.quantity;
    });
    document.getElementById('cart-total').textContent = `$${totalAmount.toFixed(2)}`;
    document.getElementById('cart-count').textContent = cart.length;
}

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const name = this.getAttribute('data-name');
        const price = parseFloat(this.getAttribute('data-price'));
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name, price, quantity: 1 });
        }
        updateCart();
        const itemPopup = document.getElementById('item-popup');
        itemPopup.textContent = `${name} added to cart`;
        itemPopup.classList.add('show');
        setTimeout(() => {
            itemPopup.classList.remove('show');
        }, 2000);
    });
});

const cartIcon = document.getElementById('cart-icon');
const cartPopup = document.getElementById('cart-popup');

cartIcon.addEventListener('mouseenter', function() {
    cartPopup.classList.add('show');
    clearTimeout(cartTimeout);
});

cartIcon.addEventListener('mouseleave', function() {
    cartTimeout = setTimeout(() => {
        cartPopup.classList.remove('show');
    }, 10000); // Hide the popup after 10 seconds
});

cartPopup.addEventListener('mouseenter', function() {
    clearTimeout(cartTimeout);
});

cartPopup.addEventListener('mouseleave', function() {
    cartTimeout = setTimeout(() => {
        cartPopup.classList.remove('show');
    }, 10000); // Hide the popup after 10 seconds
});

// Ensure cart does not block other events
document.getElementById('checkout-button').addEventListener('click', function() {
    const totalAmount = parseFloat(document.getElementById('cart-total').textContent.replace('$', ''));
    
    // Ensure totalAmount is valid before proceeding to Razorpay
    if (totalAmount > 0) {
        const options = {
            "key": "YOUR_RAZORPAY_KEY_ID", 
            "amount": totalAmount * 100, // Amount in paise
            "currency": "USD",
            "name": "Innova",
            "description": "Thank you for your purchase",
            "handler": function (response) {
                alert('Payment successful');
            },
            "prefill": {
                "name": "Customer Name",
                "email": "customer@example.com",
                "contact": "9999999999"
            },
            "theme": {
                "color": "#2874f0"
            }
        };
        const rzp1 = new Razorpay(options);
        rzp1.open();
    } else {
        alert('Your cart is empty.');
    }
});

// Popup logic and cookie consent
window.onload = function() {
    // Show popup and overlay after 3 seconds
    setTimeout(function() {
        document.getElementById('popup-overlay').style.display = 'block';
        document.getElementById('popup-box').style.display = 'block';
    }, 3000);

    // Close the popup
    document.getElementById('popup-close').onclick = function() {
        document.getElementById('popup-overlay').style.display = 'none';
        document.getElementById('popup-box').style.display = 'none';
    };

    // Show cookie consent after 3 seconds
    setTimeout(function() {
        document.getElementById('cookie-consent').style.display = 'block';
    }, 3000);

    // Handle cookie consent buttons
    document.getElementById('cookie-accept').onclick = function() {
        alert('You have accepted the cookies.');
        document.getElementById('cookie-consent').style.display = 'none';
    };

    document.getElementById('cookie-deny').onclick = function() {
        alert('You have denied the cookies.');
        document.getElementById('cookie-consent').style.display = 'none';
    };

    document.getElementById('cookie-balanced').onclick = function() {
        alert('You have selected balanced cookies.');
        document.getElementById('cookie-consent').style.display = 'none';
    };
};
