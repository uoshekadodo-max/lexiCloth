import cartService from "../services/cartService.js";

import orderservices from "../services/orderservices.js";

import { CONFIG } from "../core/config.js";

import toast from "../components/toast.js";

let shippingCost = 0;

document.addEventListener(

    "DOMContentLoaded",
    initCheckout
);

function initCheckout() {

    renderOrderSummary();

    initializeDeliveryOptions();

    initializeCheckoutForm();

    initializePayment();

}
function renderOrderSummary() {
    const itemsContainer = document.getElementById("checkoutItems");
    const itemCount = document.getElementById("checkoutItemCount");

    const subtotalElement = document.getElementById("checkoutSubtotal");

    const shippingElement = document.getElementById("checkoutShipping");

    const taxElement = document.getElementById("checkoutTax");
    const totalElement = document.getElementById("checkoutTotal");
    const cart = cartService.getItems();
    if (!cart.length) {
        itemsContainer.innerHTML = `
            <p class="empty-cart">

                Your cart is empty.

            </p>

        `;

        itemCount.textContent = "0 Items";

        subtotalElement.textContent = `${CONFIG.CURRENCY}0.00`;

        shippingElement.textContent = "Free";

        taxElement.textContent = `${CONFIG.CURRENCY}0.00`;

        totalElement.textContent = `${CONFIG.CURRENCY}0.00`;

        return;

    }

    itemsContainer.innerHTML = "";

    let subtotal = 0;

    cart.forEach(item => {

        subtotal += item.price * item.quantity;

        itemsContainer.appendChild(

            createCheckoutItem(item)

        );

    });

    itemCount.textContent = `${cart.length} Item${cart.length > 1 ? "s" : ""}`;

   const shipping = shippingCost;

    const tax = subtotal * 0.08;

    const total = subtotal + shipping + tax;

    subtotalElement.textContent = `${CONFIG.CURRENCY}${subtotal.toLocaleString()}`;

    shippingElement.textContent = shipping === 0

    ? "Free"

    : `${CONFIG.CURRENCY}${shipping.toFixed(2)}`;

    taxElement.textContent = `${CONFIG.CURRENCY}${tax.toFixed(2)}`;

    totalElement.textContent = `${CONFIG.CURRENCY}${total.toFixed(2)}`;

}


function initializeDeliveryOptions() {

    const deliveryOptions = document.querySelectorAll(

        'input[name="delivery"]'

    );

    deliveryOptions.forEach(option => {

        option.addEventListener("change", () => {

            updateDeliverySelection();

            renderOrderSummary();

        });

    });

}

function createCheckoutItem(item) {

    const card = document.createElement("div");
    card.className = "order-item";

    card.innerHTML = `
        <div class="item-img-wrap">

            <img

                src="${CONFIG.PATHS.IMAGES}${item.image}"
                alt="${item.name}"
            >
            <span class="item-qty-badge">
                ${item.quantity}
            </span>

        </div>

        <div class="item-details">
            <h4>
                ${item.name}
            </h4>
            <p class="item-meta">
                Size: ${item.size || "-"}
                |
                Color: ${item.color || "-"}

            </p>
        </div>
        <span class="item-price">
            ${CONFIG.CURRENCY}${(item.price * item.quantity).toLocaleString()}
        </span>
    `;
    return card;
}
function updateDeliverySelection() {
    const cards = document.querySelectorAll(".delivery-card");

    cards.forEach(card =>

        card.classList.remove("active")

    );

    const selected = document.querySelector(

        'input[name="delivery"]:checked'

    );

    selected.closest(".delivery-card")

        .classList.add("active");

    shippingCost =

        selected.value === "express"

            ? 15

            : 0;

}

function initializeCheckoutForm() {

    const form = document.getElementById("checkout-form");

    form.addEventListener(
        "submit",
        handleCheckoutSubmit

    );

}

function handleCheckoutSubmit(event) {

    event.preventDefault();

    const form = event.target;

    if (

        !validateCheckoutForm(form)

    ) return;

    showPaymentStep();

}

function validateCheckoutForm(form) {

    let valid = true;

    const requiredFields = form.querySelectorAll(

        "[required]"

    );

    requiredFields.forEach(field => {

        if (

            field.value.trim() === ""

        ) {

            showFieldError(field);

            valid = false;

        }

        else {

            clearFieldError(field);

        }

    });

   valid = validateEmail(form) && valid;

valid = validatePhone(form) && valid;
return valid;

}

function validateEmail(form) {

    const email = form.email;

    const pattern =

        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (

        !pattern.test(

            email.value.trim()

        )

    ) {

        showFieldError(email);

        return false;

    }

    clearFieldError(email);

    return true;

}
function validatePhone(form) {
    const phone = form.phone;
    const pattern =
        /^[0-9+\-\s]{7,20}$/;

    if (
        !pattern.test(
            phone.value.trim()
        )
    ) {
        showFieldError(phone);
        return false;
    }
    clearFieldError(phone);
    return true;
}
function showFieldError(field) {
    field.classList.add("invalid");
    field.classList.remove("valid");
}
function clearFieldError(field) {
    field.classList.remove("invalid");
    field.classList.add("valid");
}
function showPaymentStep() {

    document.getElementById(

        "shippingStep"

    ).style.display = "none";

    document.getElementById(

        "paymentStep"

    ).style.display = "block";

    document

        .querySelectorAll(".step")[1]

        .classList.add("active");

      

}


function initializePayment() {

    const radios = document.querySelectorAll(

        'input[name="payment"]'

    );

    radios.forEach(radio => {

        radio.addEventListener(

            "change",

            updatePaymentUI

        );

    });

    updatePaymentUI();

    document

        .getElementById(

            "placeOrder"

        )

        .addEventListener(

            "click",

            completeOrder

        );

}


function updatePaymentUI() {

    const content = document.getElementById(

        "paymentContent"

    );

    const selected = document.querySelector(

        'input[name="payment"]:checked'

    ).value;

    document.querySelectorAll(

        ".payment-card"

    ).forEach(card =>

        card.classList.remove(

            "active"

        )

    );

    document.querySelector(

        'input[name="payment"]:checked'

    )

    .closest(

        ".payment-card"

    )

    .classList.add(

        "active"

    );

    switch (selected) {

        case "card":

            content.innerHTML = `

                <div class="input-group">

                    <input

                        type="text"

                        placeholder="Card Number">

                </div>

                <div class="input-group">

                    <input

                        type="text"

                        placeholder="Name On Card">

                </div>

                <div class="input-group">

                    <input

                        type="text"

                        placeholder="MM/YY">

                </div>

                <div class="input-group">

                    <input

                        type="password"

                        placeholder="CVV">

                </div>

            `;

            break;

        case "bank":

            content.innerHTML = `

                <div class="bank-box">

                    <h3>

                        Bank Transfer

                    </h3>

                    <p>

                        Bank:

                        First Bank

                    </p>

                    <p>

                        Account:

                        1234567890

                    </p>

                    <p>

                        Name:

                        LexiCloth

                    </p>

                </div>

            `;

            break;

        case "cod":

            content.innerHTML = `

                <div class="cod-box">

                    Pay when your order arrives.

                </div>

            `;

            break;

    }

}


async function completeOrder() {

    console.log("completeOrder started");

const button = document.getElementById("placeOrder");

    button.classList.add("loading");

    if (!cartService.count()) {

        toast.error("Your cart is empty.");

        button.classList.remove("loading");

        return;

    }

 try {

    await fakeProcessing();

    const cart = cartService.getItems();

    const order = {

        id: generateOrderId(),

        date: new Date().toISOString(),

        customer: {

            firstName: document.getElementById("firstName").value,

            lastName: document.getElementById("lastName").value,

            email: document.getElementById("email").value,

            phone: document.getElementById("phone").value,

            address: document.getElementById("address").value,

            city: document.getElementById("city").value,

            state: document.getElementById("state").value,

            notes: document.getElementById("notes").value

        },

        delivery: document.querySelector(
            'input[name="delivery"]:checked'
        ).value,

        payment: document.querySelector(
            'input[name="payment"]:checked'
        ).value,

        items: cart,

        subtotal: calculateSubtotal(),

        shipping: shippingCost,

        tax: calculateTax(),

        total: calculateTotal()

    };

    // Save Order
    orderservices.saveOrder(order);

    // Clear Cart
    cartService.clear();

    // Update Navbar Count
    document.dispatchEvent(
        new CustomEvent("cartUpdated")
    );

    // Success Message
    toast.success("Order placed successfully!");

    // Small delay before redirect
    setTimeout(() => {

        window.location.href =
            `success.html?id=${order.id}`;

    }, 1200);

}
catch (error) {

    console.error("Checkout Error:", error);

    button.classList.remove("loading");

    toast.error("Something went wrong. Please try again.");

}
finally {

    button.classList.remove("loading");

}

}

function generateOrderId() {

    const random = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

    return `LEX-${Date.now()}-${random}`;

}

function fakeProcessing() {

    return new Promise(resolve => {

        setTimeout(resolve, 2000);

    });

}

function calculateSubtotal() {

    return cartService.getItems().reduce(

        (total, item) =>

            total +

            item.price * item.quantity,

        0

    );

}


function calculateTax() {

    return calculateSubtotal() * 0.08;

}


function calculateTotal() {

    return (

        calculateSubtotal()

        + shippingCost

        + calculateTax()

    );

}


