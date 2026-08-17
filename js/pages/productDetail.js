import productRepository from "../respositories/product.respository.js";

import cartService from "../services/cartService.js";

import toast from "../components/toast.js";

import { renderProducts } from "../components/productCard.js";

import wishlist from "../services/wishlistService.js";

import recentlyView from "../components/recentlyView.js";

import { ProductSlider } from "../components/slider.js";
import products from "../data/data.js";

import recommendedProducts from "../components/recommendedProducts.js";

const elements = {

    category: document.getElementById("product-category"),

    name: document.getElementById("product-name"),

    price: document.getElementById("product-price"),

    description: document.getElementById("product-description"),

    brand: document.getElementById("product-brand"),

    sku: document.getElementById("product-sku"),

    stock: document.getElementById("product-stock"),

    mainImage: document.getElementById("main-image"),

    thumbnails: document.getElementById("thumbnail-container"),

    stars: document.getElementById("product-stars"),

    reviewCount: document.getElementById("product-review-count"),

    sizeOptions: document.getElementById("size-options"),

    colorOptions: document.getElementById("color-options"),

    quantity: document.getElementById("quantity"),

    minus: document.getElementById("minus"),

    plus: document.getElementById("plus"),

    addCart: document.getElementById("add-cart"),

    addWishlist: document.getElementById("add-wishlist"),

    relatedProducts: document.getElementById("relatedContainer")

};

let selectedSize = null;
let selectedColor = null;
let quantity = 1;
let currentProduct = null;

document.addEventListener("DOMContentLoaded", initProductPage);

function initProductPage() {

    loadProduct();

}


function loadProduct() {

    const params = new URLSearchParams(window.location.search);

    const productId = Number(params.get("id"));

    const product = productRepository.getById(productId);

    if (!product) {

        window.location.href = "shop.html";

        return;

    }
    productRepository.saveRecentlyViewed(product.id);
    
currentProduct = product;




renderProduct(product);

renderGallery(product);

renderRating(product);

renderSizes(product);

renderColors(product);

renderQuantity(product);

recommendedProducts.render({

    wrapper: "#recommendedWrapper",

    container: "#recommendedContainer",

    prev: "#recommendedPrev",

    next: "#recommendedNext",

    currentProduct: product,

    limit: 8,

    options: {

        showWishlist: true,

        showCartButton: true,

        showViewButton: true

    }

});
updateCartButton();

elements.addCart.addEventListener("click", handleAddToCart);


const isWishlisted = wishlist
    .getItems()
    .some(item => item.id === product.id);

updateWishlistButton(isWishlisted);

elements.addWishlist.addEventListener(
    "click",
    handleWishlist
);

}

function renderProduct(product) {

    elements.category.textContent = product.category;

    elements.name.textContent = product.name;

    elements.price.textContent =
        `₦${product.price.toLocaleString()}`;

    elements.description.textContent =
        product.description;

    elements.brand.textContent =
        product.brand;

    elements.sku.textContent =
        product.sku;

    elements.stock.textContent =
        `${product.stock} In Stock`;

}


function renderGallery(product) {

    elements.mainImage.src = `../images/${product.image}`;

    elements.mainImage.alt = product.name;

    elements.thumbnails.innerHTML = "";

    product.gallery.forEach((image, index) => {

        const thumbnail = document.createElement("img");

        thumbnail.src = `../images/${image}`;

        thumbnail.alt = product.name;

        thumbnail.classList.add("thumbnail");

        if (index === 0) {

            thumbnail.classList.add("active");

        }

        thumbnail.addEventListener("click", () => {

            elements.mainImage.src = `../images/${image}`;

            document.querySelectorAll(".thumbnail").forEach(img => {

                img.classList.remove("active");

            });

            thumbnail.classList.add("active");

        });

        elements.thumbnails.appendChild(thumbnail);

    });

}

function renderRating(product) {

    elements.stars.innerHTML = "";

    const fullStars = Math.floor(product.rating);

    const hasHalfStar = product.rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {

        elements.stars.innerHTML +=
            `<i class="fa-solid fa-star"></i>`;

    }

    if (hasHalfStar) {

        elements.stars.innerHTML +=
            `<i class="fa-solid fa-star-half-stroke"></i>`;

    }

    const emptyStars = 5 - Math.ceil(product.rating);

    for (let i = 0; i < emptyStars; i++) {

        elements.stars.innerHTML +=
            `<i class="fa-regular fa-star"></i>`;

    }

    elements.reviewCount.textContent =
        `${product.rating} (${product.reviews} Reviews)`;

}

function renderSizes(product) {

    elements.sizeOptions.innerHTML = "";

    selectedSize = null;

    product.sizes.forEach(size => {

        const button = document.createElement("button");

        button.textContent = size;

        button.classList.add("size-btn");

        button.addEventListener("click", () => {

            selectedSize = size;

            document.querySelectorAll(".size-btn").forEach(btn => {

                btn.classList.remove("active");

            });

            button.classList.add("active");

        });

        elements.sizeOptions.appendChild(button);

    });

}


function renderColors(product) {

    elements.colorOptions.innerHTML = "";

    selectedColor = null;

    product.colors.forEach(color => {

        const button = document.createElement("button");

        button.textContent = color;

        button.classList.add("color-btn");

        button.dataset.color = color;

        button.addEventListener("click", () => {

            selectedColor = color;

            document.querySelectorAll(".color-btn").forEach(btn => {

                btn.classList.remove("active");

            });

            button.classList.add("active");

        });

        elements.colorOptions.appendChild(button);

    });

}

function renderQuantity(product) {

    quantity = 1;
    

    updateQuantityDisplay();

    elements.minus.addEventListener("click", () => {

        if (quantity > 1) {

            quantity--;

            updateQuantityDisplay();

        }

       

    });

    elements.plus.addEventListener("click", () => {

        if (quantity < product.stock) {

            quantity++;

            updateQuantityDisplay();

        }

    });

}


function updateQuantityDisplay() {

    elements.quantity.value = quantity;

}

 


function updateCartButton(state = "default") {

    switch (state) {

        case "loading":

            elements.addCart.disabled = true;

            elements.addCart.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Adding...
            `;

            break;

        case "success":

            elements.addCart.innerHTML = `
                <i class="fa-solid fa-check"></i>
                Added
            `;

            break;

        default:

            elements.addCart.disabled = false;

            elements.addCart.innerHTML = `
                <i class="fa-solid fa-cart-shopping"></i>
                Add To Cart
            `;

    }

}

function updateWishlistButton(isWishlisted) {

    if (isWishlisted) {

        elements.addWishlist.innerHTML = `
            <i class="fa-solid fa-heart"></i>
            Wishlisted
        `;

        elements.addWishlist.classList.add("active");

    } else {

        elements.addWishlist.innerHTML = `
            <i class="fa-regular fa-heart"></i>
            Add to Wishlist
        `;

        elements.addWishlist.classList.remove("active");

    }

}

function handleAddToCart() {

    if (!selectedSize) {

        toast.error("Please select a size.");

        return;

    }

    if (!selectedColor) {

        toast.error("Please select a color.");

        return;

    }

    updateCartButton("loading");

     cartService.add(
        currentProduct,
        quantity,
        selectedSize,
        selectedColor
    );

    document.dispatchEvent(

        new CustomEvent("cartUpdated")

    );

    toast.success("Product added to cart.");

    updateCartButton("success");

    setTimeout(() => {

        updateCartButton();

    }, 1200);

}

function handleWishlist() {

    const exists = wishlist.getItems().some(item =>
        item.id === currentProduct.id
    );

    if (exists) {

        toast.warning("Product already in wishlist.");

        return;

    }

    wishlist.add(currentProduct);

    toast.success("Added to wishlist.");

    document.dispatchEvent(

        new CustomEvent("wishlistUpdated")

    );

    updateWishlistButton(true);

}




recentlyView.render({

    wrapper:"#recentWrapper",

    container:"#recentContainer",

    prev:"#recentPrev",

    next:"#recentNext",

    excludeId:products.id,


    limit:4,

    options:{

        showWishlist:true,

        showCartButton:true,

        showViewButton:true

    }

});