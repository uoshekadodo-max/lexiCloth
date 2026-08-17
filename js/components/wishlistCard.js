import { CONFIG } from "../core/config.js";

export function createWishlistCard(product) {

    const card = document.createElement("article");

 

    card.className = "wishlist-card";

    card.dataset.id = product.id;

    card.innerHTML = `

        <div class="wishlist-image">

            <img

                src="${CONFIG.PATHS.IMAGES}${product.image}"

                alt="${product.name}"

            >

        </div>

        <div class="wishlist-info">

            <h3>${product.name}</h3>

            <p class="wishlist-brand">

                ${product.brand}

            </p>

            <div class="wishlist-rating">

                ⭐ ${product.rating}

                <span>

                    (${product.reviews})

                </span>

            </div>

            <div class="wishlist-price">

                ${CONFIG.CURRENCY}${product.price.toLocaleString()}

            </div>

            <div class="wishlist-actions">

                <button

                    class="move-cart-btn"

                    data-action="moveCart"

                    data-id="${product.id}"

                >

                    <i class="fa-solid fa-cart-shopping"></i>

                    Move To Cart

                </button>

                <div class="wishlist-bottom">

                    <button

                        class="view-btn"

                        data-action="view"

                        data-id="${product.id}"

                    >

                        <i class="fa-solid fa-eye"></i>

                        View

                    </button>

                    <button

                        class="remove-btn"

                        data-action="remove"

                        data-id="${product.id}"

                    >

                        <i class="fa-solid fa-trash"></i>

                        Remove

                    </button>

                </div>

            </div>

        </div>

    `;

  

return card;




}