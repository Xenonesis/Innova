document.addEventListener('DOMContentLoaded', () => {
    const cart = [];
    const cartElement = document.getElementById('cart');
    const cartItemsElement = document.getElementById('cart-items');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', event => {
            const item = event.target.closest('.category').querySelector('h2').innerText;
            cart.push(item);
            updateCart();
            animateButton(event.target);
        });
    });

    function updateCart() {
        cartElement.innerText = `Cart (${cart.length})`;
        cartItemsElement.innerHTML = '';
        if (cart.length === 0) {
            cartItemsElement.innerHTML = '<p>No items in cart</p>';
        } else {
            cart.forEach(item => {
                const div = document.createElement('div');
                div.innerText = item;
                cartItemsElement.appendChild(div);
            });
        }
    }

    function animateButton(button) {
        button.classList.add('animate');
        setTimeout(() => {
            button.classList.remove('animate');
        }, 500);
    }
});
