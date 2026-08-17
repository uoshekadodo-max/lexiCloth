import productRepository from "../respositories/product.respository.js";

import { renderProducts } from "./productCard.js";

import { ProductSlider } from "./slider.js";

class RecentlyViewed {

    render({

        wrapper,

        container,

        prev,

        next,

        excludeId = null,

        limit = 8,

        options = {}

    }) {

        const productContainer =

            document.querySelector(container);

        if (!productContainer) return;

    let products =
    productRepository.getRecentlyViewed();

products = products.slice(

    0,

    limit

);

        if (excludeId !== null) {

            products = products.filter(product =>

                product.id !== excludeId

            );

        }

        if (products.length === 0) {

            productContainer.innerHTML = `

                <div class="empty-recent">

                    <p>

                        No recently viewed products.

                    </p>

                </div>

            `;

            return;

        }

        renderProducts(

            products,

            productContainer,

            options

        );

        if (

            wrapper &&

            prev &&

            next &&

            products.length > 1

        ) {

            new ProductSlider({

                wrapper,

                track: container,

                prev,

                next,

                autoSpeed: 4000

            });

        }

    }

}

export default new RecentlyViewed();