import searchService from "../services/searchService.js";

import { CONFIG } from "../core/config.js";

class GlobalSearch {

    constructor() {

        this.input = null;
        this.resultsBox = null;

        this.results = [];
        this.selectedIndex = -1;

        this.searchTimer = null;

        this.initialized = false;

    }


    init() {

        if (this.initialized) return;


        this.input =
            document.getElementById("search");


        if (!this.input) {

            console.warn(
                "GlobalSearch: Search input not found."
            );

            return;

        }


        this.createResultsBox();

        this.initializeEvents();

        this.initialized = true;

    }


    createResultsBox() {

        this.resultsBox =
            document.createElement("div");


        this.resultsBox.className =
            "global-search-results";


        this.resultsBox.setAttribute(
            "role",
            "listbox"
        );


        this.input.parentElement.appendChild(
            this.resultsBox
        );

    }


    initializeEvents() {

        // ==========================
        // SEARCH INPUT
        // ==========================

        this.input.addEventListener(
            "input",
            () => {

                this.selectedIndex = -1;

                clearTimeout(
                    this.searchTimer
                );


                this.searchTimer =
                    setTimeout(() => {

                        this.handleSearch();

                    }, 250);

            }
        );


        // ==========================
        // KEYBOARD
        // ==========================

        this.input.addEventListener(
            "keydown",
            (event) => {

                if (
                    !this.results.length
                ) {

                    if (
                        event.key === "Escape"
                    ) {

                        this.close();

                    }

                    return;

                }


                switch (event.key) {

                    case "ArrowDown":

                        event.preventDefault();

                        this.moveSelection(1);

                        break;


                    case "ArrowUp":

                        event.preventDefault();

                        this.moveSelection(-1);

                        break;


           case "Enter":

    event.preventDefault();


    if (
        this.selectedIndex >= 0
    ) {

        this.selectCurrent();

    } else {

        this.openSearchPage();

    }

    break;

                    case "Escape":

                        event.preventDefault();

                        this.close();

                        break;

                }

            }
        );


        // ==========================
        // CLICK OUTSIDE
        // ==========================

        document.addEventListener(
            "click",
            (event) => {

                if (

                    !this.input.contains(
                        event.target
                    ) &&

                    !this.resultsBox.contains(
                        event.target
                    )

                ) {

                    this.close();

                }

            }
        );

    }


    // ==============================
    // SEARCH
    // ==============================

    handleSearch() {

        const query =
            this.input.value.trim();


        if (!query) {

            this.close();

            return;

        }


        this.results =
            searchService.search(
                query,
                8
            );


        this.selectedIndex = -1;


        this.renderResults();

    }


    // ==============================
    // RENDER RESULTS
    // ==============================

    renderResults() {

        this.resultsBox.innerHTML = "";


        if (
            this.results.length === 0
        ) {

            this.resultsBox.innerHTML = `

                <div class="search-no-results">

                    <p>
                        No products found.
                    </p>

                </div>

            `;


            this.open();

            return;

        }


        const fragment =
            document.createDocumentFragment();


        this.results.forEach(
            (product, index) => {

                const result =
                    document.createElement("button");


                result.type = "button";

                result.className =
                    "search-result";


                result.dataset.id =
                    product.id;


                result.dataset.index =
                    index;


                result.setAttribute(
                    "role",
                    "option"
                );


               const query =
    this.input.value.trim();


result.innerHTML = `

    <span class="search-result-info">

        <strong>
            ${this.highlightMatch(
                product.name,
                query
            )}
        </strong>

    </span>

`;

                result.addEventListener(
                    "click",
                    () => {

                        this.openProduct(
                            product.id
                        );

                    }
                );


                fragment.appendChild(
                    result
                );

            }
        );


        this.resultsBox.appendChild(
            fragment
        );


        this.open();

    }


    // ==============================
    // KEYBOARD SELECTION
    // ==============================

    moveSelection(direction) {

        if (
            !this.results.length
        ) return;


        this.selectedIndex += direction;


        if (
            this.selectedIndex < 0
        ) {

            this.selectedIndex =
                this.results.length - 1;

        }


        if (
            this.selectedIndex >=
            this.results.length
        ) {

            this.selectedIndex = 0;

        }


        this.updateSelection();

    }


    updateSelection() {

        const resultButtons =
            this.resultsBox.querySelectorAll(
                ".search-result"
            );


        resultButtons.forEach(
            (button, index) => {

                button.classList.toggle(

                    "selected",

                    index ===
                    this.selectedIndex

                );

            }
        );

    }


    // ==============================
    // ENTER
    // ==============================

    selectCurrent() {

        if (
            this.selectedIndex < 0
        ) {

            return;

        }


        const product =
            this.results[
                this.selectedIndex
            ];


        if (!product) return;


        this.openProduct(
            product.id
        );

    }


    // ==============================
    // OPEN PRODUCT
    // ==============================

 openProduct(productId) {

    window.location.href =
        `${CONFIG.PATHS.PRODUCT_DETAILS}?id=${productId}`;

}

    // ==============================
    // OPEN
    // ==============================

    open() {

        this.resultsBox.classList.add(
            "active"
        );

    }


    // ==============================
    // CLOSE
    // ==============================

    close() {

        if (!this.resultsBox) return;


        this.resultsBox.classList.remove(
            "active"
        );


        this.resultsBox.innerHTML = "";


        this.results = [];

        this.selectedIndex = -1;

    }

    highlightMatch(text, query) {

    if (!query) {

        return text;

    }


    const escapedQuery =
        query.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );


    const regex =
        new RegExp(
            `(${escapedQuery})`,
            "gi"
        );


    return text.replace(
        regex,
        "<mark>$1</mark>"
    );

}
openSearchPage() {

    const query =
        this.input.value.trim();


    if (!query) return;


  window.location.href =
    `${CONFIG.PATHS.SEARCH}?q=${encodeURIComponent(query)}`;

}

}


const globalSearch =
    new GlobalSearch();


export default globalSearch;