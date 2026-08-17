import wishlist from "../services/wishlistService.js";

import { createWishlistCard } from "../components/wishlistCard.js";

import { renderProducts } from "../components/productCard.js";

import cartService from "../services/cartService.js";

import recentlyView from "../components/recentlyView.js";

import { ProductSlider } from "../components/slider.js";
import toast from "../components/toast.js";

import wishlistService from "../services/wishlistService.js";

import recommendedProducts from "../components/recommendedProducts.js";
import products from "../data/data.js";

document.addEventListener(
    "DOMContentLoaded",
    initWishlistPage
);

function initWishlistPage() {

    initializeWishlistEvents();

    loadWishlist();

    const clearButton = document.getElementById("clearWishlist");

    if (clearButton) {

        clearButton.addEventListener(

            "click",

            clearWishlist

        );

    }

}

function loadWishlist() {

    const products = wishlistService.getItems();



    renderWishlist(products);
    updateWishlistCount(products.length);

    recommendedProducts.render({

        wrapper: "#recommendedWrapper",

        container: "#recommendedContainer",

        prev: "#recommendedPrev",

        next: "#recommendedNext",

        limit: 8,

        excludeWishlist: true,

        options: {

            showWishlist: true,

            showCartButton: true,

            showViewButton: true

        }

    });

}


function renderWishlist(products) {

    const container = document.getElementById("wishlistContainer");

    const emptyState = document.getElementById("wishlistEmpty");

    container.innerHTML = "";

    if (products.length === 0) {

        container.style.display = "none";

        emptyState.style.display = "flex";

        return;

    }

    container.style.display = "grid";

    emptyState.style.display = "none";

  const fragment = document.createDocumentFragment();

products.forEach(product => {

    fragment.appendChild(

        createWishlistCard(product)

    );

});



container.appendChild(fragment);


initializeWishlistEvents();

    container.querySelectorAll(".remove-wishlist").forEach(button => {

    button.addEventListener("click", () => {

        removeWishlistProduct(

            Number(button.dataset.id)

        );

    });

});

}


function updateWishlistCount(count) {

    const counter = document.getElementById("wishlistCount");

    if (!counter) return;

    counter.textContent = count;

}


function initializeWishlistEvents() {

    const container = document.getElementById("wishlistContainer");

    if (!container) return;

    if (container.dataset.eventsInitialized === "true") {

        return;

    }

    container.dataset.eventsInitialized = "true";

    container.addEventListener(

        "click",

        handleWishlistActions

    );

}



function handleWishlistActions(event) {

    const button = event.target.closest("[data-action]");

    if (!button) return;

    const action = button.dataset.action;

    const productId = Number(button.dataset.id);

    switch (action) {

        case "moveCart":

            moveProductToCart(productId);

            break;

        case "remove":

            removeWishlistProduct(productId);

            break;

        case "view":

            window.location.href =
                `productDetails.html?id=${productId}`;

            break;

    }

}



function removeWishlistProduct(productId) {

    wishlistService.remove(productId);

    loadWishlist();

    document.dispatchEvent(

        new CustomEvent("wishlistUpdated")

    );

    toast.success("Removed from wishlist.");

}


function clearWishlist() {

    if (!confirm("Clear your entire wishlist?")) {

        return;

    }

    wishlistService.clear();

    loadWishlist();

    document.dispatchEvent(

        new CustomEvent("wishlistUpdated")

    );

    toast.success("Wishlist cleared.");

}


function moveProductToCart(productId) {

    const product = wishlistService
        .getItems()
        .find(item => item.id === productId);

    if (!product) return;

    cartService.add({

        ...product,

        quantity: 1,

        size: product.sizes?.[0] || "",

        color: product.colors?.[0] || ""

    });

    wishlistService.remove(productId);

    loadWishlist();

    document.dispatchEvent(

        new CustomEvent("wishlistUpdated")

    );

    document.dispatchEvent(

        new CustomEvent("cartUpdated")

    );

    toast.success("Moved to cart.");

}

recentlyView.render({

    wrapper:"#recentWrapper",

    container:"#recentContainer",

    prev:"#recentPrev",

    next:"#recentNext",

    limit:4,

    options:{

        showWishlist:true,

        showCartButton:true,

        showViewButton:true

    }

});

recommendedProducts.render({

    container: "#relatedContainer",

    currentProduct: products,

    limit: 4,

    options: {

        showWishlist: true,

        showCartButton: true,

        showViewButton: true

    }

});