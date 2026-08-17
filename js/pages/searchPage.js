import searchService
    from "../services/searchService.js";

import { renderProducts }
    from "../components/productCard.js";


const container =
    document.getElementById(
        "search-products"
    );


const title =
    document.getElementById(
        "search-title"
    );


const count =
    document.getElementById(
        "search-count"
    );


function loadSearchResults() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const query =
        params.get("q")?.trim() || "";


    if (!query) {

        title.textContent =
            "Search Products";

        count.textContent =
            "Enter a search term.";

        return;

    }


    const products =
        searchService.search(
            query,
            100
        );


    title.textContent =
        `Search results for "${query}"`;


    count.textContent =
        `${products.length} product${
            products.length === 1
                ? ""
                : "s"
        } found`;


    renderProducts(
        products,
        container,
        {

            showAddToCart: true,

            showWishlist: true

        }
    );

}


loadSearchResults();