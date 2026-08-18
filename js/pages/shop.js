import productRepository from "../respositories/product.respository.js";
import { renderProducts } from "../components/productCard.js";
import cartService from "../services/cartService.js";

import recentlyView from "../components/recentlyView.js";
import toast from "../components/toast.js";
import { CONFIG } from "../core/config.js";

import recommendedProducts from "../components/recommendedProducts.js";

/*
   STATE
========================= */

const state = {

    allProducts: [],

    filteredProducts: [],

    currentCategory: "All",

    searchQuery: "",

    currentSort: "default",

    minPrice: "",

    maxPrice: "",

    currentPage: 1,

    productsPerPage: 8

};

/*
   DOM
========================= */

const elements = {

    productContainer:
        document.getElementById("shop-products"),

    pagination:
        document.getElementById("pagination"),

    productCount:
        document.getElementById("product-count"),

    search:
        document.getElementById("search"),

    sort:
        document.getElementById("sort-products"),

    minPrice:
        document.getElementById("min-price"),

    maxPrice:
        document.getElementById("max-price")

};

let selectedSize = null;
let selectedColor = null;

/*
   INIT
========================= */

document.addEventListener(

    "DOMContentLoaded",

    initShop

);

function initShop() {

    loadFilters();

    updateFilterUI();

    loadProducts();

    initializeCategoryFilter();

    initializeSearch();

    initializeSorting();

    initializePriceFilter();


    initializeQuickView();

        document.addEventListener("quickView", (event) => {

        openQuickView(event.detail.productId);

    });

}






function initializeCategoryFilter() {

    const buttons = document.querySelectorAll(".category-btn");

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            buttons.forEach(btn =>

                btn.classList.remove("active")

            );

            button.classList.add("active");

            state.currentCategory =

                button.dataset.category;

            state.currentPage = 1;

            applyFilters();

        });

    });

}

function initializeSearch() {

    if (!elements.search) return;

    elements.search.addEventListener("input", (event) => {

        state.searchQuery =

            event.target.value

            .trim()

            .toLowerCase();

        state.currentPage = 1;

        applyFilters();

    });

}

function initializeSorting() {

    if (!elements.sort) return;

    elements.sort.addEventListener("change", (event) => {

        state.currentSort =

            event.target.value;

        state.currentPage = 1;

        applyFilters();

    });

}

function initializePriceFilter() {

    if (!elements.minPrice || !elements.maxPrice) return;

    elements.minPrice.addEventListener("input", () => {

        state.minPrice =

            elements.minPrice.value;

        state.currentPage = 1;

        applyFilters();

    });

    elements.maxPrice.addEventListener("input", () => {

        state.maxPrice =

            elements.maxPrice.value;

        state.currentPage = 1;

        applyFilters();

    });

}

function loadProducts() {

    showSkeleton();

    setTimeout(() => {

        state.allProducts =
            productRepository.getAll();

        state.filteredProducts = [

            ...state.allProducts

        ];

        applyFilters();

        hideSkeleton();

    },300);

}

function renderCurrentProducts(products){

    renderProducts(

        products,

        elements.productContainer

    );

}

function updateProductCounter(){

    if(!elements.productCount) return;

    elements.productCount.textContent =

    `Showing ${state.filteredProducts.length} of ${state.allProducts.length} products`;

}

function showSkeleton() {

    if (!elements.productContainer) return;

    let html = "";

    for (let i = 0; i < state.productsPerPage; i++) {

        html += `

        <div class="product-skeleton">

            <div class="skeleton-image"></div>

            <div class="skeleton-title"></div>

            <div class="skeleton-price"></div>

            <div class="skeleton-button"></div>

        </div>

        `;

    }

    elements.productContainer.innerHTML = html;

}

function hideSkeleton(){

}


function applyFilters() {

    /*
       RESET PRODUCTS
    */

    let products = [...state.allProducts];

    /*
       CATEGORY
    */

    if (state.currentCategory !== "All") {

        products = products.filter(product =>

            product.category === state.currentCategory

        );

    }

    /*
       SEARCH
    */

    if (state.searchQuery !== "") {

        products = products.filter(product => {

            const name = product.name.toLowerCase();

            const category = product.category.toLowerCase();

            const brand = (product.brand || "").toLowerCase();

            return (

                name.includes(state.searchQuery) ||

                category.includes(state.searchQuery) ||

                brand.includes(state.searchQuery)

            );

        });

    }

    /*
       MIN PRICE
    */

    if (state.minPrice !== "") {

        products = products.filter(product =>

            product.price >= Number(state.minPrice)

        );

    }

    /*
       MAX PRICE
    */

    if (state.maxPrice !== "") {

        products = products.filter(product =>

            product.price <= Number(state.maxPrice)

        );

    }

    /*
       SORTING
    */

    switch (state.currentSort) {

        case "price-low":

            products.sort(

                (a,b)=>a.price-b.price

            );

            break;

        case "price-high":

            products.sort(

                (a,b)=>b.price-a.price

            );

            break;

        case "rating":

            products.sort(

                (a,b)=>b.rating-a.rating

            );

            break;

        case "name":

            products.sort(

                (a,b)=>a.name.localeCompare(b.name)

            );

            break;

        case "newest":

            products.sort(

                (a,b)=>b.id-a.id

            );

            break;

    }

    /*
       SAVE FILTERED PRODUCTS
    */

    state.filteredProducts = products;

    /*
       EMPTY STATE
    */

    if (!products.length) {

        showEmptyState();

        updateProductCounter();

        if(elements.pagination){

            elements.pagination.innerHTML = "";

        }

        return;

    }

    /*
       PAGINATION
    */

    const start =

        (state.currentPage-1) *

        state.productsPerPage;

    const end =

        start +

        state.productsPerPage;

    const currentProducts =

        products.slice(start,end);

    updateProductCounter();

    renderCurrentProducts(currentProducts);
    animateProducts();

    renderPagination();

    saveFilters();

}


function saveFilters() {

    const filterState = {

        category: state.currentCategory,

        search: state.searchQuery,

        sort: state.currentSort,

        minPrice: state.minPrice,

        maxPrice: state.maxPrice,

        page: state.currentPage

    };

    localStorage.setItem(

        "shopFilters",

        JSON.stringify(filterState)

    );

}

function loadFilters() {

    const saved = JSON.parse(

        localStorage.getItem("shopFilters")

    );

    if (!saved) return;

    state.currentCategory = saved.category || "All";

    state.searchQuery = saved.search || "";

    state.currentSort = saved.sort || "default";

    state.minPrice = saved.minPrice || "";

    state.maxPrice = saved.maxPrice || "";

    state.currentPage = saved.page || 1;

}


function updateFilterUI() {

    document.querySelectorAll(".category-btn")

    .forEach(button => {

        button.classList.toggle(

            "active",

            button.dataset.category === state.currentCategory

        );

    });

    if (elements.search)

        elements.search.value = state.searchQuery;

    if (elements.sort)

        elements.sort.value = state.currentSort;

    if (elements.minPrice)

        elements.minPrice.value = state.minPrice;

    if (elements.maxPrice)

        elements.maxPrice.value = state.maxPrice;

}


function showEmptyState() {

    elements.productContainer.innerHTML = `

    <div class="empty-products">

        <div class="empty-icon">

            🔍

        </div>

        <h2>

            No Products Found

        </h2>

        <p>

            Try another search or change your filters.

        </p>

        <button
            class="btn-primary"
            id="resetFilters">

            Reset Filters

        </button>

    </div>

    `;

    document

        .getElementById("resetFilters")

        .addEventListener("click", resetFilters);

}


function resetFilters() {

    state.currentCategory = "All";

    state.searchQuery = "";

    state.currentSort = "default";

    state.minPrice = "";

    state.maxPrice = "";

    state.currentPage = 1;

    updateFilterUI();

    applyFilters();

}


function renderPagination() {

    if (!elements.pagination) return;

    elements.pagination.innerHTML = "";

    const totalPages = Math.ceil(

        state.filteredProducts.length /

        state.productsPerPage

    );

    if (totalPages <= 1) return;

    /*
       PREVIOUS BUTTON
    */

    const previous = createPaginationButton(

        "←",

        state.currentPage - 1,

        state.currentPage === 1

    );

    elements.pagination.appendChild(previous);

    /*
       PAGE NUMBERS
    */

    const maxVisible = 5;

    let startPage = Math.max(

        1,

        state.currentPage - 2

    );

    let endPage = Math.min(

        totalPages,

        startPage + maxVisible - 1

    );

    if (endPage - startPage < maxVisible - 1) {

        startPage = Math.max(

            1,

            endPage - maxVisible + 1

        );

    }

    if (startPage > 1) {

        elements.pagination.appendChild(

            createPaginationButton(

                1,

                1

            )

        );

        if (startPage > 2) {

            const dots = document.createElement("span");

            dots.className = "pagination-dots";

            dots.textContent = "...";

            elements.pagination.appendChild(dots);

        }

    }

    for (

        let page = startPage;

        page <= endPage;

        page++

    ) {

        const button = createPaginationButton(

            page,

            page,

            false,

            page === state.currentPage

        );

        elements.pagination.appendChild(button);

    }

    if (endPage < totalPages) {

        if (endPage < totalPages - 1) {

            const dots = document.createElement("span");

            dots.className = "pagination-dots";

            dots.textContent = "...";

            elements.pagination.appendChild(dots);

        }

        elements.pagination.appendChild(

            createPaginationButton(

                totalPages,

                totalPages

            )

        );

    }

    /*
       NEXT BUTTON
    */

    const next = createPaginationButton(

        "→",

        state.currentPage + 1,

        state.currentPage === totalPages

    );

    elements.pagination.appendChild(next);

}

function createPaginationButton(

    text,

    page,

    disabled = false,

    active = false

) {

    const button = document.createElement("button");

    button.textContent = text;

    button.className = "pagination-btn";

    if (active) {

        button.classList.add("active");

    }

    if (disabled) {

        button.disabled = true;

    }

    button.addEventListener("click", () => {

        state.currentPage = page;

        applyFilters();

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

    return button;

}


recentlyView.render({

    wrapper:"#recentWrapper",

    container:"#recent-products",

    prev:"#recentPrev",

    next:"#recentNext",

    limit:6,

    options:{

        showWishlist:true,

        showCartButton:true,

        showViewButton:true

    }

});

recommendedProducts.render({

    wrapper: "#recommendedWrapper",

    container: "#recommendedContainer",

    prev: "#recommendedPrev",

    next: "#recommendedNext",

    limit: 8,

    options: {

        showWishlist: true,

        showCartButton: true,

        showViewButton: true

    }

});


function animateProducts() {

    const cards = document.querySelectorAll(".product-card");

    cards.forEach((card, index) => {

        card.style.opacity = "0";

        card.style.transform = "translateY(40px)";

        setTimeout(() => {

            card.style.transition =
                "all .45s ease";

            card.style.opacity = "1";

            card.style.transform =
                "translateY(0)";

        }, index * 70);

    });

}



requestAnimationFrame(() => {

    initializeRecentSlider();

});

let recentIndex = 0;

function initializeRecentSlider(){

    const track = document.getElementById("recent-products");

    if(!track) return;

    const cards = track.children;

    if(cards.length===0) return;

    const prev = document.getElementById("recentPrev");

    const next = document.getElementById("recentNext");

    const updateSlider=()=>{

        const cardWidth=

        cards[0].offsetWidth+20;

        track.style.transform=

        `translateX(-${recentIndex*cardWidth}px)`;

    };

    next.addEventListener("click",()=>{

        if(recentIndex<cards.length-1){

            recentIndex++;

        }else{

            recentIndex=0;

        }

        updateSlider();

    });

    prev.addEventListener("click",()=>{

        if(recentIndex>0){

            recentIndex--;

        }else{

            recentIndex=cards.length-1;

        }

        updateSlider();

    });

    setInterval(()=>{

        next.click();

    },4000);

}

function initializeQuickView() {

    if (document.body.dataset.quickViewInitialized === "true") {

        return;

    }

    document.body.dataset.quickViewInitialized = "true";

    document.addEventListener("click", (event) => {

        const quickViewButton = event.target.closest(
            '[data-action="quickView"]'
        );

        if (quickViewButton) {

            event.preventDefault();

            event.stopPropagation();

            openQuickView(
                Number(quickViewButton.dataset.id)
            );

            return;

        }

        // Close button
        if (event.target.closest("#closeQuickView")) {

            closeQuickView();

            return;

        }

        // Click outside the modal
        if (event.target.id === "quickViewModal") {

            closeQuickView();

        }

    });

    const modal = document.getElementById("quickViewModal");

modal.addEventListener("click",(event)=>{

    if(event.target === modal){

        closeQuickView();

    }

});

document.addEventListener("keydown",(event)=>{

    if(event.key === "Escape"){

        closeQuickView();

    }

});

}

 

function openQuickView(productId) {

   

    const product = productRepository.getById(productId);

    


    if (!product) return;

    selectedSize = product.sizes?.[0] ?? null;

selectedColor = product.colors?.[0] ?? null;

    const content = document.getElementById("quickViewContent");



    content.innerHTML = `

    <div class="quick-view-layout">

        <div class="quick-gallery">

            <img
                class="quick-main-image"
                src="${CONFIG.PATHS.IMAGES}${product.image}"
                alt="${product.name}"
            >

            <div class="quick-thumbnails">

                ${product.gallery.map(image => `

                    <img
                        class="quick-thumb"
                        src="${CONFIG.PATHS.IMAGES}${image}"
                        data-image="${CONFIG.PATHS.IMAGES}${image}"
                    >

                `).join("")}

            </div>

        </div>

        <div class="quick-details">

            <h2>${product.name}</h2>

            <div class="quick-rating">

                ⭐ ${product.rating}

                <span>

                    (${product.reviews} Reviews)

                </span>

            </div>

            <h3>

                ${CONFIG.CURRENCY}${product.price.toLocaleString()}

            </h3>

            <p>

                ${product.description}

            </p>

            <div class="quick-size">

                <h4>Sizes</h4>

                <div class="size-list">

                    ${product.sizes.map(size => `

                        <button class="size-btn">

                            ${size}

                        </button>

                    `).join("")}

                </div>

            </div>

            <div class="quick-color">

                <h4>Colors</h4>

                <div class="color-list">

                    ${product.colors.map(color => `

                        <button class="color-btn">

                            ${color}

                        </button>

                    `).join("")}

                </div>

            </div>

            <div class="quick-actions">

            <div class="quick-purchase">

    <div class="quick-quantity">

        <button id="quick-minus">−</button>

        <input
            type="number"
            id="quick-quantity"
            value="1"
            min="1"
            max="${product.stock}"
            readonly
        >

        <button id="quick-plus">+</button>

    </div>

    <button
        class="btn-primary quick-cart"
        data-id="${product.id}">

        <i class="fa-solid fa-cart-shopping"></i>

        Add To Cart

    </button>

    <button
        class="btn-secondary quick-details-btn"
        data-id="${product.id}">

        View Details

    </button>

</div>

            </div>

        </div>

    </div>

    `;

   const modal = document.getElementById("quickViewModal");

modal.style.display = "flex";

requestAnimationFrame(() => {

    modal.classList.add("show");

});

   initializeQuickGallery();

initializeQuickSelections(product);

initializeQuickQuantity(product.stock);

initializeQuickCart(product);

initializeQuickDetails(product.id);



}

function initializeQuickCart(product) {

    const cartButton = document.querySelector(".quick-cart");

    if (!cartButton) return;

    cartButton.onclick = () => {

        const quantity = Number(
            document.getElementById("quick-quantity").value
        );

        if (!selectedSize) {

            toast.error("Please select a size.");

            return;

        }

        if (!selectedColor) {

            toast.error("Please select a color.");

            return;

        }

       cartService.add(
    product,
    quantity,
    selectedSize,
    selectedColor
);

        toast.success(`${quantity} item(s) added to cart`);

        closeQuickView();

    };

}

function initializeQuickDetails(productId) {

    const button = document.querySelector(".quick-details-btn");

    if (!button) return;

    button.addEventListener("click", () => {

        window.location.href =
            `${CONFIG.PATHS.PRODUCT_DETAILS}?id=${productId}`;

    });

}



function closeQuickView() {

    const modal = document.getElementById("quickViewModal");

    modal.classList.remove("show");

    setTimeout(() => {

        modal.style.display = "none";

    },300);

}

function initializeQuickGallery() {

    const mainImage = document.querySelector(".quick-main-image");

    const thumbnails = document.querySelectorAll(".quick-thumb");

    if (!mainImage || thumbnails.length === 0) return;

    thumbnails.forEach((thumbnail) => {

        thumbnail.addEventListener("click", () => {

            // Change the main image
            mainImage.src = thumbnail.dataset.image;

            // Remove active class from all thumbnails
            thumbnails.forEach(img => img.classList.remove("active"));

            // Highlight current thumbnail
            thumbnail.classList.add("active");

        });

    });

}

function initializeQuickSelections(product) {

    const sizeButtons = document.querySelectorAll(".size-btn");
    const colorButtons = document.querySelectorAll(".color-btn");

    // Default selections
    selectedSize = product.sizes?.[0] || null;
    selectedColor = product.colors?.[0] || null;

    // Highlight first size
    if (sizeButtons.length > 0) {
        sizeButtons[0].classList.add("active");
    }

    // Highlight first color
    if (colorButtons.length > 0) {
        colorButtons[0].classList.add("active");
    }

    // Size selection
    sizeButtons.forEach((button, index) => {

        button.addEventListener("click", () => {

            sizeButtons.forEach(btn =>
                btn.classList.remove("active")
            );

            button.classList.add("active");

            selectedSize = product.sizes[index];

        });

    });

    // Color selection
    colorButtons.forEach((button, index) => {

        button.addEventListener("click", () => {

            colorButtons.forEach(btn =>
                btn.classList.remove("active")
            );

            button.classList.add("active");

            selectedColor = product.colors[index];

        });

    });

}


function initializeQuickQuantity(stock) {

    let quantity = 1;

    const input = document.getElementById("quick-quantity");

    const minus = document.getElementById("quick-minus");

    const plus = document.getElementById("quick-plus");

    if (!input || !minus || !plus) return;

    minus.addEventListener("click", () => {

        if (quantity > 1) {

            quantity--;

            input.value = quantity;

        }

    });

    plus.addEventListener("click", () => {

        if (quantity < stock) {

            quantity++;

            input.value = quantity;

        }

    });

}