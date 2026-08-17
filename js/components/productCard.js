import cartService from "../services/cartService.js";

import wishlistService from "../services/wishlistService.js";

import { CONFIG } from "../core/config.js";
import productRepository from "../respositories/product.respository.js";

import toast from "./toast.js";
/*=========================================================
                    DEFAULT OPTIONS
=========================================================*/

const DEFAULT_OPTIONS = {

    showWishlist: true,

    showViewButton: true,

    showCartButton: true,

    showRating: true,

    showBadge: true,

    page: "shop"

};

/*=========================================================
                PUBLIC RENDER FUNCTION
=========================================================*/

export function renderProducts(
    products = [],
    container,
    options = {}
) {

    // Check if the container exists
    if (!container) {

        console.error("renderProducts: Container not found.");

        return;

    }

    // Ensure products is an array
    if (!Array.isArray(products)) {

        console.error("renderProducts: Expected an array of products.", products);

        container.innerHTML = `
            <div class="empty-products">
                <h2>Unable to load products.</h2>
            </div>
        `;

        return;

    }

    // Merge user options with defaults
    const settings = {
        ...DEFAULT_OPTIONS,
        ...options
    };

    // Clear previous products
    container.innerHTML = "";

    // Empty state
    if (products.length === 0) {

        container.innerHTML = `
            <div class="empty-products">
                <h2>No Products Found</h2>
            </div>
        `;

        return;

    }

    // Better performance than innerHTML +=
    const fragment = document.createDocumentFragment();

    for (const product of products) {

        fragment.appendChild(

            createProductCard(
                product,
                settings
            )

        );

    }

    container.appendChild(fragment);

    // Attach events
    initializeProductEvents(
        container,
        settings
    );

}


/*=========================================================
                CREATE PRODUCT CARD
=========================================================*/

function createProductCard(product, settings) {

    const card = document.createElement("article");

    card.className = "product-card";

    card.dataset.id = product.id;

    card.innerHTML = createProductHTML(

        product,

        settings

    );

    return card;

}

/*=========================================================
                CREATE PRODUCT HTML
=========================================================*/

function createProductHTML(product, settings) {



    return `

        <div class="product-image">



            ${settings.showBadge && product.bestSeller
                ? `<span class="badge">Best Seller</span>`
                : ""}

      ${settings.showWishlist
    ? `
    <button
        class="wishlist-btn"
        data-action="wishlist"
        data-id="${product.id}"
    >

        <i class="${
    wishlistService.has(product.id)
        ? "fa-solid fa-heart"
        : "fa-regular fa-heart"
}"></i>

    </button>
    `
    : ""}

${settings.showRemoveWishlist
    ? `
    <button
        class="remove-wishlist-btn"
        data-action="removeWishlist"
        data-id="${product.id}"
    >

        <i class="fa-solid fa-trash"></i>

    </button>
    `
    : ""}

    <button
    class="quick-view-btn"
    data-action="quickView"
    data-id="${product.id}">

    <i class="fa-solid fa-eye"></i>

    Quick View

</button>

            <img
                src="${CONFIG.PATHS.IMAGES}${product.image}"
                alt="${product.name}"
                loading="lazy"
            >

        </div>

        <div class="product-info">

            ${settings.showRating
                ? `
                <div class="rating">

                    ⭐ ${product.rating}
                    <span>

                        (${product.reviews})

                    </span>

                </div>
                `
                : ""}

            <h3 class="product-name">

                ${product.name}

            </h3>

            <div class="price-box">

                <span class="price">

                    ${CONFIG.CURRENCY}${product.price.toLocaleString()}

                </span>

            </div>

            <div class="card-buttons">

                ${settings.showViewButton
                    ? `
                    <button
                        class="view-btn"
                        data-action="view"
                        data-id="${product.id}"
                    >

                        View

                    </button>
                    `
                    : ""}

                ${settings.showCartButton
                    ? `
                    <button
                        class="cart-btn"
                        data-action="cart"
                        data-id="${product.id}"
                    >

                        Add To Cart

                    </button>
                    `
                    : ""}

            </div>

        </div>

    `;



}

/*=========================================================
            INITIALIZE PRODUCT EVENTS
=========================================================*/

function initializeProductEvents(container, settings) {

    if (container.dataset.eventsInitialized === "true") {

        return;

    }

    container.dataset.eventsInitialized = "true";

    container.addEventListener("click", (event) => {

        const button = event.target.closest("[data-action]");

        if (!button) return;

        event.preventDefault();

        event.stopPropagation();

        const action = button.dataset.action;

        const productId = Number(button.dataset.id);

       switch (action) {

    case "wishlist":

        handleWishlistClick(
            button,
            productId
        );

        break;

    case "removeWishlist":

        handleRemoveWishlistClick(
            productId
        );

        break;

    case "cart":

        handleCartClick(
            productId
        );

        break;

    case "view":

        handleViewClick(
            productId
        );

        break;

       case "quickView":

    document.dispatchEvent(

        new CustomEvent("quickView", {

            detail: {

                productId

            }

        })

    );

    break;

}
    });

    container.addEventListener("click", (event) => {

      const actionButton = event.target.closest("[data-action]");

if (actionButton) {

    return;

}

        const card = event.target.closest(".product-card");

        if (!card) return;

        const productId = Number(card.dataset.id);

        handleViewClick(productId);

    });

}


/*=========================================================
                WISHLIST HANDLER
=========================================================*/

function handleWishlistClick(button, productId) {

    const product = productRepository.getById(productId);

    if (!product) return;

    wishlistService.toggle(product);

    updateWishlistIcon(

        button,

        wishlistService.has(productId)

    );

    if (wishlistService.has(productId)) {

        toast.success("Added to wishlist");

    } else {

        toast.info("Removed from wishlist");

    }

    document.dispatchEvent(

        new CustomEvent("wishlistUpdated", {

            detail: {

                count: wishlistService.count()

            }

        })

    );

    function updateWishlistIcon(button, isActive) {

    const icon = button.querySelector("i");

    if (!icon) return;

    button.classList.remove("active");

    void button.offsetWidth;

    button.classList.add("active");

    icon.className = isActive

        ? "fa-solid fa-heart"

        : "fa-regular fa-heart";

}

}

function handleRemoveWishlistClick(productId) {

    wishlistService.remove(productId);

    toast.success("Removed from wishlist.");

    document.dispatchEvent(

        new CustomEvent("wishlistUpdated")

    );

    const card = document.querySelector(

        `.product-card[data-id="${productId}"]`

    );

    if (card) {

        card.remove();

    }

    if (wishlistService.count() === 0) {

        const container = document.getElementById("wishlistContainer");

        const emptyState = document.getElementById("wishlistEmpty");

        if (container) {

            container.style.display = "none";

        }

        if (emptyState) {

            emptyState.style.display = "flex";

        }

    }

}


/*=========================================================
            UPDATE WISHLIST ICON
=========================================================*/

function updateWishlistIcon(button, isActive) {

    const icon = button.querySelector("i");

    if (!icon) return;

    icon.className = isActive

        ? "fa-solid fa-heart"

        : "fa-regular fa-heart";

}


/*=========================================================
                    CART HANDLER
=========================================================*/

function handleCartClick(productId) {

const product = productRepository.getById(productId);;

    if (!product) return;

    cartService.add({

        ...product,

        quantity: 1,

        size: "Default",

        color: "Default"

    });

    toast.success("Product added to cart");

    document.dispatchEvent(

        new CustomEvent("cartUpdated", {

            detail: {

                count: cartService.count(),

                total: cartService.total()

            }

        })

    );

}


/*=========================================================
                    VIEW HANDLER
=========================================================*/

function handleViewClick(productId) {

    window.location.href =

        `${CONFIG.PATHS.PRODUCT_DETAILS}?id=${productId}`;

}


/*=========================================================
                FIND BUTTON BY PRODUCT ID
=========================================================*/

function findProductButton(container, productId, action) {

    return container.querySelector(

        `[data-action="${action}"][data-id="${productId}"]`

    );

}