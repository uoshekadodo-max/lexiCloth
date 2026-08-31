import orderservices from "../services/orderservices.js";

import { CONFIG } from "../core/config.js";


document.addEventListener("DOMContentLoaded", initSuccess);

function initSuccess() {

    const order = getCurrentOrder();

if (!order) {

    console.log("No order found");

    return;

}

    renderOrder(order);

}

function getCurrentOrder() {

    const params = new URLSearchParams(window.location.search);

    const orderId = params.get("id");

    if (!orderId) return null;

    const orders = orderservices.getOrders();

    return orders.find(order => order.id === orderId);

}

function renderOrder(order) {

    document.getElementById("orderId").textContent =
        order.id;

    document.getElementById("orderDate").textContent =
        formatDate(order.date);

    document.getElementById("paymentMethod").textContent =
        formatPayment(order.payment);


        document.getElementById("customerName").textContent =

`Thank you, ${order.customer.firstName}!`;

    document.getElementById("deliveryMethod").textContent =
        formatDelivery(order.delivery);

    renderPurchasedItems(order);

}



function renderPurchasedItems(order) {

    const container =
        document.getElementById("orderedItems");

    container.innerHTML = "";

    order.items.forEach(item => {

        container.innerHTML += `

            <div class="ordered-product">

                  <img
                      src="${CONFIG.PATHS.IMAGES}${item.image}"
                      alt="${item.name}"
                  >

                <div class="ordered-info">

                    <h4>

                        ${item.name}

                    </h4>

                    <p>

                        Quantity :
                        ${item.quantity}

                    </p>

                </div>

                <div class="ordered-price">

                    $${(

                        item.price *
                        item.quantity

                    ).toLocaleString()}

                </div>

            </div>

        `;

    });

    document.getElementById("summarySubtotal").textContent =
        `$${order.subtotal.toLocaleString()}`;

    document.getElementById("summaryShipping").textContent =
        `$${order.shipping.toLocaleString()}`;

    document.getElementById("summaryTax").textContent =
        `$${order.tax.toLocaleString()}`;

    document.getElementById("summaryTotal").textContent =
        `$${order.total.toLocaleString()}`;

}


function formatDate(date) {

    return new Date(date).toLocaleDateString(

        "en-US",

        {

            weekday: "long",

            year: "numeric",

            month: "long",

            day: "numeric"

        }

    );

}

function formatPayment(payment) {

    switch (payment) {

        case "card":

            return "Debit / Credit Card";

        case "bank":

            return "Bank Transfer";

        case "cod":

            return "Cash On Delivery";

        default:

            return payment;

    }

}

function formatDelivery(delivery) {

    switch (delivery) {

        case "standard":

            return "Standard Shipping";

        case "express":

            return "Express Shipping";

        default:

            return delivery;

    }

}