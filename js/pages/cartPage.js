import cartService from "../services/cartService.js";
import toast from "../components/toast.js";
import { CONFIG } from "../core/config.js";

const cartContainer = document.getElementById("cart-items");

document.addEventListener("DOMContentLoaded", initCartPage);

function initCartPage() {

    loadCart();

}

function loadCart() {

    const cart = cartService.getItems();


    const summary = document.getElementById("cart-summary");

    if (summary) {

        summary.style.display = cart.length ? "block" : "none";

    }

      renderCart(cart);
      renderSummary(cart)

      attachEvents();
}


function renderCart(cart) {

    const summary = document.getElementById("cart-summary");

    if (cart.length === 0) {

        cartContainer.innerHTML = `

            <div class="empty-cart">

                <h2>Your cart is empty</h2>

                <p>You haven't added any products yet.</p>

                <a href="#" class="continue-shopping">

                    Continue Shopping

                </a>

            </div>

        `;



      

        return;

    }

   

    cartContainer.innerHTML = "";

    cartContainer.innerHTML = "";

    cart.forEach(product => {

      cartContainer.innerHTML += `

<div class="cart-item">

 <div class="cart-image">
    <img
        src="${CONFIG.PATHS.IMAGES}${product.image}"
        alt="${product.name}"
    >
</div>

    <div class="cart-details">

        <h3>${product.name}</h3>

        <p class="price">
            ₦${product.price.toLocaleString()}
        </p>

        <div class="quantity-control">

            <button
                class="decrease"
                data-id="${product.id}"
                data-size="${product.size}"
                data-color="${product.color}"
            >
                -
            </button>

            <span>${product.quantity}</span>

            <button
                class="increase"
                data-id="${product.id}"
                data-size="${product.size}"
                data-color="${product.color}"
            >
                +
            </button>
        </div>

        <button
            class="remove-item"
            data-id="${product.id}"
            data-size="${product.size ?? ""}"
data-color="${product.color ?? ""}"
        >
            REMOVE
        </button>

    </div>
</div>

`;

    });



}


           const continueShopping =
    document.getElementById("continue-shopping");

if (continueShopping) {
    continueShopping.href = CONFIG.PATHS.SHOP;
}

  const checkoutButton = document.getElementById("checkout-btn")

checkoutButton.addEventListener("click", () => {

    if (!cartService.count()) {

        toast.error("Your cart is empty.");

        return;

    }

    window.location.href = "checkout.html";

});


function attachEvents() {

    
     document.querySelectorAll(".increase").forEach(button => {

        button.addEventListener("click", increaseQuantity);

    });

    document.querySelectorAll(".decrease").forEach(button => {

        button.addEventListener("click", decreaseQuantity);

    });

    document.querySelectorAll(".remove-item").forEach(button => {

        button.addEventListener("click", removeItem);

    });

}

function increaseQuantity(e) {

    const button = e.currentTarget;

    const item = cartService.getItems().find(product =>

        String(product.id) === String(button.dataset.id) &&

        String(product.size) === String(button.dataset.size) &&

        String(product.color) === String(button.dataset.color)

    );

    if (!item) return;

    cartService.updateQuantity(

        item.id,
        item.size,
        item.color,
        Number(item.quantity) + 1

    );

    loadCart();

}


function decreaseQuantity(e) {

    const button = e.currentTarget;

    const item = cartService.getItems().find(product =>

        String(product.id) === String(button.dataset.id) &&

        String(product.size) === String(button.dataset.size) &&

        String(product.color) === String(button.dataset.color)

    );

    if (!item) return;

    cartService.updateQuantity(

        item.id,
        item.size,
        item.color,
        Number(item.quantity) - 1

    );

    loadCart();

}


function removeItem(e) {

    const button = e.currentTarget;

    const item = cartService.getItems().find(product =>

        String(product.id) === String(button.dataset.id) &&

        String(product.size) === String(button.dataset.size) &&

        String(product.color) === String(button.dataset.color)

    );

    if (!item) return;

    cartService.remove(

        item.id,
        item.size,
        item.color

    );

    loadCart();

}





function clearCart() {
    // Optional: Ask for user confirmation before clearing everything
    if (confirm("Are you sure you want to clear your cart?")) {
        cartService.clear();
        loadCart(); // Refresh the cart UI, same as removeItem
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const clearBtn = document.getElementById("clear-cart-btn");
    
    if (clearBtn) {
        clearBtn.addEventListener("click", clearCart);
    }
});

function renderSummary(cart) {

    const subtotalElement = document.getElementById("subtotal");

    const totalElement = document.getElementById("total");

    const total = cart.reduce((sum, product) => {

        return sum + (product.price * product.quantity);

    }, 0);

    subtotalElement.textContent =
        `₦${total.toLocaleString()}`;

    totalElement.textContent =
        `₦${total.toLocaleString()}`;

}




