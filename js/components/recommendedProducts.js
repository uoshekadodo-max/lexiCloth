
import productRepository from "../respositories/product.respository.js";

import { renderProducts } from "./productCard.js";

import cartService from "../services/cartService.js";

import wishlistService from "../services/wishlistService.js";

class RecommendedProducts {

    getUserPreferences() {

    const recentlyViewed =
        productRepository.getRecentlyViewed();

    const wishlist =
        wishlistService.getItems();

    const cart =
        cartService.getItems();


    const categories = new Map();

    const brands = new Map();


    const addPreference = (product, weight) => {

        if (!product) return;


        if (product.category) {

            categories.set(

                product.category,

                (categories.get(product.category) || 0)
                + weight

            );

        }


        if (product.brand) {

            brands.set(

                product.brand,

                (brands.get(product.brand) || 0)
                + weight

            );

        }

    };


    // Recently viewed = moderate interest
    recentlyViewed.forEach(product => {

        addPreference(product, 10);

    });


    // Wishlist = stronger interest
    wishlist.forEach(product => {

        addPreference(product, 20);

    });


    // Cart = strongest buying signal
    cart.forEach(item => {

        addPreference(item, 30);

    });


    return {

        categories,

        brands

    };

}

applyDiversity(products, limit) {

    if (products.length <= limit) {

        return products;

    }


    const selected = [];

    const categoryCount = new Map();


    /*
    |--------------------------------------------------------------------------
    | FIRST PASS
    | Prefer strong recommendations but limit repeated categories
    |--------------------------------------------------------------------------
    */

    for (const product of products) {

        if (selected.length >= limit) {

            break;

        }


        const category = product.category || "Other";

        const count =
            categoryCount.get(category) || 0;


        // Maximum 2 products from the same category
        if (count >= 2) {

            continue;

        }


        selected.push(product);

        categoryCount.set(

            category,

            count + 1

        );

    }


    /*
    |--------------------------------------------------------------------------
    | SECOND PASS
    | Fill remaining spaces if necessary
    |--------------------------------------------------------------------------
    */

    if (selected.length < limit) {

        for (const product of products) {

            if (selected.length >= limit) {

                break;

            }


            const alreadySelected =
                selected.some(

                    item => item.id === product.id

                );


            if (alreadySelected) {

                continue;

            }


            selected.push(product);

        }

    }


    return selected;

}

    render({

        container,

        currentProduct = null,

        limit = 4,

         excludeWishlist = false,

        options = {}

    }) {

        const productContainer =
            document.querySelector(container);

        if (!productContainer) return;


        const allProducts =
            productRepository.getAll();

            const wishlistItems =
    wishlistService.getItems();
         
            const preferences =
    this.getUserPreferences();

        let products = [];


        /*
        |--------------------------------------------------------------------------
        | BUILD RECOMMENDATION SCORES
        |--------------------------------------------------------------------------
        */

        products = allProducts

            // Never recommend the product currently being viewed
            .filter(product => {

    // Never recommend the current product
    if (

        currentProduct &&

        product.id === currentProduct.id

    ) {

        return false;

    }


    // Optionally exclude wishlist products
    if (excludeWishlist) {

        const alreadyWishlisted =

            wishlistItems.some(

                item => item.id === product.id

            );

        if (alreadyWishlisted) {

            return false;

        }

    }


    return true;

})

            .map(product => {

                let score = 0;



                if (product.category) {

    score +=

        preferences.categories.get(

            product.category

        ) || 0;

}


if (product.brand) {

    score +=

        preferences.brands.get(

            product.brand

        ) || 0;

}
                /*
                |--------------------------------------------------------------------------
                | PRODUCT RELATIONSHIP
                |--------------------------------------------------------------------------
                */

                if (currentProduct) {

                    // Same category is the strongest relationship
                    if (

                        product.category ===
                        currentProduct.category

                    ) {

                        score += 50;

                    }


                    // Same brand
                    if (

                        product.brand ===
                        currentProduct.brand

                    ) {

                        score += 25;

                    }

                }


                /*
                |--------------------------------------------------------------------------
                | PRODUCT PERFORMANCE
                |--------------------------------------------------------------------------
                */

                // Best sellers get a strong boost
                if (product.bestSeller) {

                    score += 15;

                }


                // Featured products get a smaller boost
                if (product.featured) {

                    score += 10;

                }


                /*
                |--------------------------------------------------------------------------
                | CUSTOMER RATING
                |--------------------------------------------------------------------------
                */

                if (

                    typeof product.rating === "number"

                ) {

                    score += product.rating;

                }


                return {

                    ...product,

                    recommendationScore: score

                };

            })


            /*
            |--------------------------------------------------------------------------
            | HIGHEST SCORE FIRST
            |--------------------------------------------------------------------------
            */

            .sort(

                (a, b) =>

                    b.recommendationScore -
                    a.recommendationScore

            );


        /*
        |--------------------------------------------------------------------------
        | REMOVE DUPLICATES
        |--------------------------------------------------------------------------
        */

        products = [

            ...new Map(

                products.map(product => [

                    product.id,

                    product

                ])

            ).values()

        ];


        /*
        |--------------------------------------------------------------------------
        | LIMIT RESULTS
        |--------------------------------------------------------------------------
        */

      products = this.applyDiversity(

    products,

    limit

);


        /*
        |--------------------------------------------------------------------------
        | EMPTY STATE
        |--------------------------------------------------------------------------
        */

        if (products.length === 0) {

            productContainer.innerHTML = `

                <div class="empty-products">

                    <p>

                        No recommendations available.

                    </p>

                </div>

            `;

            return;

        }


        /*
        |--------------------------------------------------------------------------
        | REMOVE INTERNAL SCORE
        |--------------------------------------------------------------------------
        */

        const cleanProducts =

            products.map(

                ({ recommendationScore, ...product }) =>

                    product

            );


        /*
        |--------------------------------------------------------------------------
        | RENDER PRODUCTS
        |--------------------------------------------------------------------------
        */

        renderProducts(

            cleanProducts,

            productContainer,

            options

        );

    }

}


export default new RecommendedProducts();

