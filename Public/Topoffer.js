document.addEventListener('DOMContentLoaded', function () {
    const cartItems = document.getElementById('cart-items');
    const checkoutButton = document.getElementById('checkout-button');
    const popup = document.getElementById('popup');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function updateCart() {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) {
            cartItems.innerHTML = '<p>No items in cart</p>';
        } else {
            cartItems.innerHTML = cart.map(item => 
                `<p>${item.name} - ₹${item.price} x ${item.quantity}</p>`
            ).join('');
        }
    }

    function showPopup() {
        popup.style.display = 'block';
        setTimeout(() => {
            popup.style.display = 'none';
        }, 2000);
    }

    checkoutButton.addEventListener('click', function () {
        const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const options = {
            key: 'your_key_id', // Replace with your Razorpay key_id
            amount: totalAmount * 100, // Razorpay amount should be in paise
            currency: "INR",
            name: "Innova",
            description: "Test Transaction",
            image: "/logo.png",
            handler: function (response) {
                alert(response.razorpay_payment_id);
                alert(response.razorpay_order_id);
                alert(response.razorpay_signature);
                // Redirect to cart.html after payment success
                window.location.href = 'cart.html';
            },
            prefill: {
                name: "Aditya Kumar Tiwari",
                email: "test@example.com",
                contact: "9999999999"
            },
            notes: {
                address: "Razorpay Corporate Office"
            },
            theme: {
                color: "#3399cc"
            }
        };
        const rzp1 = new Razorpay(options);
        rzp1.on('payment.failed', function (response) {
            alert(response.error.description);
        });
        rzp1.open();
    });

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function () {
            const product = {
                name: this.getAttribute('data-name'),
                price: parseFloat(this.getAttribute('data-price')),
                quantity: 1
            };

            const existingProduct = cart.find(item => item.name === product.name);
            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                cart.push(product);
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCart();
            showPopup();
        });
    });

    updateCart();
});

function sortProducts(criteria) {
    const products = Array.from(document.querySelectorAll('.product-card'));
    products.sort((a, b) => {
        const priceA = parseFloat(a.getAttribute('data-price'));
        const priceB = parseFloat(b.getAttribute('data-price'));
        const nameA = a.getAttribute('data-name').toLowerCase();
        const nameB = b.getAttribute('data-name').toLowerCase();

        if (criteria === 'price-asc') {
            return priceA - priceB;
        } else if (criteria === 'price-desc') {
            return priceB - priceA;
        } else if (criteria === 'name') {
            return nameA.localeCompare(nameB);
        }
        return 0;
    });

    const container = document.getElementById('product-container');
    products.forEach(product => container.appendChild(product));
}

function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    products.forEach(product => {
        if (category === 'all' || product.getAttribute('data-category') === category) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

function captureReview(productId) {
    const reviewInput = document.getElementById(`review-input-${productId}`);
    const reviewsDiv = document.getElementById(`reviews-${productId}`);
    const reviewText = reviewInput.value.trim();

    if (reviewText) {
        const review = document.createElement('p');
        review.textContent = reviewText;
        reviewsDiv.appendChild(review);
        reviewInput.value = '';
    }
}
