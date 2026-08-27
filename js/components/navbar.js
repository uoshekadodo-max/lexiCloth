import cartService from "../services/cartService.js";
import wishlistService from "../services/wishlistService.js";
import globalSearch from "./globalSearch.js";


// ===============================
// Navigation
// ===============================

const isHtmlPage = window.location.pathname.includes("/html/");

const pagePaths = {
    home: isHtmlPage ? "../index.html" : "./index.html",
    shop: isHtmlPage ? "./shop.html" : "./html/shop.html",
    about: isHtmlPage ? "./about.html" : "./html/about.html",
    contact: isHtmlPage ? "./contact.html" : "./html/contact.html",
    wishlist: isHtmlPage ? "./wishlist.html" : "./html/wishlist.html",
    cart: isHtmlPage ? "./cart.html" : "./html/cart.html"
}; 

document.querySelectorAll("[data-nav]").forEach((link) => {

    const page = link.dataset.nav;

    if (pagePaths[page]) {
        link.href = pagePaths[page];
    }

});



// Mobile Menu
const menuBtn = document.getElementById("menu-btn");
const closeBtn = document.getElementById("close-menu");
const sidebar = document.getElementById("mobile-menu");
const overlay = document.getElementById("overlay");

if (menuBtn && closeBtn && sidebar && overlay) {

    const openSidebar = () => {
        sidebar.classList.add("active");
        overlay.classList.add("active");
        document.body.classList.add("menu-open");
    };

    const closeSidebar = () => {
        sidebar.classList.remove("active");
        overlay.classList.remove("active");
        document.body.classList.remove("menu-open");
    };

    menuBtn.addEventListener("click", openSidebar);
    closeBtn.addEventListener("click", closeSidebar);
    overlay.addEventListener("click", closeSidebar);

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeSidebar();
        }
    });

}

// 
// Navbar Counts
// 

function updateNavbarCounts() {

    const cartCount = document.getElementById("cart-count");
    const wishlistCount = document.getElementById("wishlist-count");

    if (cartCount) {

        const totalCart = cartService.count();

        cartCount.textContent = totalCart;
        cartCount.style.display = totalCart ? "flex" : "none";

    }

    if (wishlistCount) {

        const totalWishlist = JSON.parse(
            localStorage.getItem("lexicloth_wishlist") || "[]"
        ).length;

        wishlistCount.textContent = totalWishlist;
        wishlistCount.style.display = totalWishlist ? "flex" : "none";

    }

}

// Run immediately
updateNavbarCounts();

// Listen for updates
document.addEventListener("cartUpdated", updateNavbarCounts);

document.addEventListener("wishlistUpdated", updateNavbarCounts);