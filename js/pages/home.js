import productRepository from "../respositories/product.respository.js";

import { renderProducts } from "../components/productCard.js";

import { initHeroSlider } from "../components/heroslider.js";

import { ProductSlider } from "../components/slider.js";

import { initWardrobe } from "../components/wardrobe.js";


const featuredContainer = document.getElementById("featuredContainer");
const bestSellerContainer = document.getElementById("bestSellerContainer");
const newArrivalContainer = document.getElementById("newArrivalContainer");

document.addEventListener("DOMContentLoaded", initHomePage);

function initHomePage() {

    loadProductSections();

    initializeComponents();
  
    initializeProductSliders();
}

function loadProductSections() {

    renderProducts(

        productRepository.getFeatured(),
        featuredContainer
        
    );

    renderProducts(
        productRepository.getBestSellers(),
        bestSellerContainer
        
    );

    renderProducts(

         productRepository.getNewArrivals(),
        newArrivalContainer
       
    );

}

function initializeComponents() {

    // Hero Slider
    initHeroSlider();
   


    // Newsletter
    // initNewsletter();

    // Wardrobe Animation

    initWardrobe()

    // Testimonials
    // initTestimonials();

    // Back To Top
    // initBackToTop();

}

function initializeProductSliders() {

    new ProductSlider({

        wrapper: "#featuredWrapper",

        track: "#featuredContainer",

        prev: "#featPrev",

        next: "#featNext",

        autoSpeed: 3000

    });

    new ProductSlider({

        wrapper: "#bestSellerWrapper",

        track: "#bestSellerContainer",

        prev: "#bestPrev",

        next: "#bestNext",

        autoSpeed: 3000

    });

    new ProductSlider({

        wrapper: "#newArrivalWrapper",

        track: "#newArrivalContainer",

        prev: "#newPrev",

        next: "#newNext",

        autoSpeed: 3000

    });

}


