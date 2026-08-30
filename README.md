# LexiCloth --- Premium Vanilla E-Commerce Frontend

LexiCloth is a responsive fashion e-commerce frontend built with **HTML,
CSS, and modern JavaScript (ES modules)**.

The project is currently a **frontend-only application**. Product data
and customer shopping state are handled on the client side, with Local
Storage used for cart and wishlist persistence. The project is
structured so a backend can be introduced later without rebuilding the
entire frontend.

------------------------------------------------------------------------

## Current Project Status

**Version:** 2.0.0\
**Application:** LexiCloth\
**Stack:** HTML5, CSS3, JavaScript (ES Modules)\
**Backend:** Not implemented yet\
**Database:** Not implemented yet\
**Primary currency:** Nigerian Naira (₦ / NGN)\
**Hosting target:** GitHub Pages project site

Example GitHub Pages URL:

``` text
https://username.github.io/lexicloth/
```

------------------------------------------------------------------------

## What LexiCloth Currently Includes

### Shopping experience

-   Responsive homepage
-   Product shop page
-   Product details page
-   Product search
-   Product filtering and sorting
-   Product pagination
-   Featured products
-   Best sellers
-   New arrivals
-   Product recommendations
-   Recently viewed products
-   Quick-view functionality
-   Wishlist
-   Shopping cart
-   Checkout page
-   Order-success page

### Customer-facing pages

-   Home
-   Shop
-   Product Details
-   Search
-   Wishlist
-   Cart
-   Checkout
-   Success
-   About
-   Contact

### Reusable website components

-   Reusable navbar
-   Reusable footer
-   Product cards
-   Wishlist product cards
-   Sliders
-   Hero slider
-   Pagination
-   Modal
-   Toast notifications
-   Loader
-   Recently viewed products
-   Recommended products
-   Wardrobe/review interaction
-   Global search

------------------------------------------------------------------------

# Project Structure

``` text
LEXICLOTHVS2/
│
├── index.html
│
├── html/
│   ├── about.html
│   ├── cart.html
│   ├── checkout.html
│   ├── contact.html
│   ├── productDetail.html
│   ├── search.html
│   ├── shop.html
│   ├── success.html
│   ├── wishlist.html
│   │
│   └── component/
│       ├── footer.html
│       └── navbar.html
│
├── css/
│   ├── base/
│   │   ├── global.css
│   │   ├── reset.css
│   │   └── variable.css
│   │
│   ├── components/
│   │   ├── checkout.css
│   │   ├── footer.css
│   │   ├── loader.css
│   │   ├── modal.css
│   │   ├── navbar.css
│   │   ├── product-grid.css
│   │   ├── productCard.css
│   │   ├── slider.css
│   │   └── toast.css
│   │
│   └── pages/
│       ├── about.css
│       ├── cart.css
│       ├── contact.css
│       ├── home.css
│       ├── productDeatail.css
│       ├── shop.css
│       ├── success.css
│       └── wishlist.css
│
├── images/
│
├── js/
│   ├── components/
│   ├── core/
│   ├── data/
│   ├── pages/
│   ├── respositories/
│   ├── services/
│   └── utils/
│
└── README.md
```

------------------------------------------------------------------------

# JavaScript Architecture

LexiCloth uses native JavaScript modules instead of a frontend
framework.

The JavaScript is separated by responsibility.

``` text
Pages
  ↓
Components
  ↓
Services
  ↓
Repository
  ↓
Data
  ↓
Core configuration
```

This keeps page logic, reusable UI, business operations, storage, and
product data from being mixed together.

------------------------------------------------------------------------

## `js/core/`

Contains application-wide configuration and core setup.

### `config.js`

Central configuration for:

-   Application name
-   Version
-   Currency
-   Image path
-   Page paths
-   Local Storage keys

Example:

``` js
CONFIG.PATHS.CART
CONFIG.STORAGE.CART
CONFIG.CURRENCY
```

### `app.js`

Reserved for core application-level functionality.

------------------------------------------------------------------------

# `js/data/`

Contains the product dataset.

### `data.js`

Exports the LexiCloth product collection.

Product records currently support information such as:

``` text
id
name
slug
brand
category
gender
description
price
oldPrice
discount
currency
stock
sku
featured
bestSeller
newArrival
rating
reviews
image
gallery
colors
sizes
tags
```

The product data is currently local frontend data.

------------------------------------------------------------------------

# `js/respositories/`

Contains the product repository layer.

### `product.respository.js`

Acts as the access layer between the product data and the rest of the
application.

The repository is intended to prevent individual pages from needing to
know exactly where product data comes from.

> Note: the directory/file name is currently spelled
> `respositories/product.respository.js`. This naming can be cleaned up
> later, but changing it should be done carefully because imports depend
> on the current path.

------------------------------------------------------------------------

# `js/services/`

Contains reusable business/application services.

Current services include:

### `cartService.js`

Responsible for cart-related operations.

### `wishlistService.js`

Responsible for wishlist operations.

### `storage.js`

Provides Local Storage-related functionality.

### `searchService.js`

Handles reusable product-search behavior.

### `orderservices.js`

Handles frontend order-related functionality used by the
checkout/success flow.

------------------------------------------------------------------------

# `js/components/`

Contains reusable UI behavior.

Current components include:

``` text
globalSearch.js
heroslider.js
loadNavbar.js
loader.js
loadfooter.js
modal.js
navbar.js
pagination.js
productCard.js
recentlyView.js
recommendedProducts.js
slider.js
toast.js
wardrobe.js
wishlistCard.js
```

The goal is to allow different pages to reuse the same UI systems
instead of duplicating code.

------------------------------------------------------------------------

# `js/pages/`

Contains page-specific JavaScript.

Current page modules:

``` text
about.js
cartPage.js
checkout.js
contact.js
home.js
productDetail.js
searchPage.js
shop.js
success.js
whislistPage.js
```

A page module should coordinate the functionality required by its own
page while reusable functionality remains in components/services.

------------------------------------------------------------------------

# CSS Architecture

CSS is also separated by responsibility.

## `css/base/`

Global foundation styles:

``` text
reset.css
global.css
variable.css
```

These provide shared styling rules, variables, and baseline browser
normalization.

## `css/components/`

Reusable UI styling:

``` text
navbar.css
footer.css
productCard.css
product-grid.css
slider.css
toast.css
modal.css
loader.css
checkout.css
```

## `css/pages/`

Page-specific styling:

``` text
home.css
shop.css
cart.css
wishlist.css
contact.css
about.css
success.css
productDeatail.css
```

This separation helps prevent page-specific styling from unnecessarily
affecting unrelated pages.

------------------------------------------------------------------------

# Reusable Navbar and Footer

The navbar and footer are not duplicated across every page.

They are stored as reusable HTML components:

``` text
html/component/navbar.html
html/component/footer.html
```

and loaded by:

``` text
js/components/loadNavbar.js
js/components/loadfooter.js
```

This means changes to the shared navbar or footer can be made centrally.

------------------------------------------------------------------------

# Product Cards

LexiCloth uses a reusable product-card system.

The main product-card component can receive product information and
page-specific settings.

This allows the same product data to be displayed differently on
different pages.

For example:

``` text
Homepage
→ View button

Shop
→ View + Add to Cart

Wishlist
→ Wishlist-specific controls
```

This prevents each page from needing its own completely separate
product-card implementation.

------------------------------------------------------------------------

# Product Data and Product Display

The intended flow is:

``` text
data.js
   ↓
product repository
   ↓
page/service
   ↓
product card component
   ↓
HTML container
```

For example, a product section such as Featured Products has an HTML
container, while JavaScript supplies the product cards.

This keeps the HTML structure separate from the product-rendering logic.

------------------------------------------------------------------------

# Local Storage

The current frontend uses Local Storage for client-side shopping state.

Configured keys include:

``` text
lexicloth_cart
lexicloth_wishlist
```

This allows cart and wishlist information to survive page refreshes in
the same browser.

The storage layer is intentionally separated from page code so it can be
replaced or extended later.

------------------------------------------------------------------------

# Checkout

The current project contains:

``` text
checkout.html
success.html
```

The checkout flow is currently frontend-based.

A real payment gateway and backend order processing have **not** been
connected yet.

This is intentional because the current development stage is focused on
completing the frontend before introducing PHP/backend functionality.

------------------------------------------------------------------------

# Backend Roadmap

PHP is **not part of the current version**.

When backend development begins, the frontend can eventually communicate
with a backend for:

``` text
Products
Users
Authentication
Orders
Payments
Inventory
Newsletter subscriptions
Persistent wishlists
Persistent carts
```

Possible future architecture:

``` text
LexiCloth Frontend
       ↓
JavaScript Services
       ↓
API
       ↓
PHP Backend
       ↓
Database
```

The frontend should remain usable as the backend is introduced
gradually.

------------------------------------------------------------------------

# GitHub Pages Hosting

The project is intended to work as a GitHub Pages project site:

``` text
https://username.github.io/lexicloth/
```

Because `/lexicloth/` is the project base path, paths must be handled
carefully.

For example, from the root `index.html`:

``` text
./css/
./js/
./images/
```

From pages inside `html/`:

``` text
../css/
../js/
../images/
```

Avoid blindly converting every path to `/...`, because a leading `/`
refers to the domain root rather than the GitHub Pages project
directory.

Before final deployment, all CSS, JavaScript, image, component, and
navigation paths should be tested from the GitHub Pages URL.

------------------------------------------------------------------------

# Local Development

A local static server is recommended because the project uses ES modules
and dynamically loaded HTML components.

From the project root:

``` bash
python -m http.server 3000
```

Then open:

``` text
http://localhost:3000/
```

You can also use another static development server.

Avoid relying on opening the HTML files directly with:

``` text
file://
```

because browser security restrictions can interfere with modules and
dynamically fetched components.

------------------------------------------------------------------------

# Current Frontend Technology

LexiCloth currently uses:

-   HTML5
-   CSS3
-   JavaScript ES Modules
-   Local Storage
-   Font Awesome icons
-   Responsive layouts
-   Native browser APIs

No frontend framework is currently required.

------------------------------------------------------------------------

# Development Principles

When extending LexiCloth:

1.  Keep reusable functionality in reusable components.
2.  Keep business operations in services.
3.  Keep product access in the repository layer.
4.  Keep product information in the data layer.
5.  Keep page-specific coordination inside page modules.
6.  Avoid duplicating the same functionality across multiple pages.
7.  Avoid changing shared components without checking which pages use
    them.
8.  Test both desktop and mobile layouts after major UI changes.
9.  Test GitHub Pages paths before deployment.
10. Keep PHP/backend work separate until the frontend is ready.

------------------------------------------------------------------------

# Current Project Goal

The immediate goal is to finish and stabilize the **frontend version of
LexiCloth** before moving to PHP.

The project should first reach a stable state where:

``` text
Homepage
Shop
Search
Product Details
Wishlist
Cart
Checkout
Success
About
Contact
```

work together without breaking shared components.

After that, backend development can be introduced gradually.

------------------------------------------------------------------------

## License

This project is currently a personal development project for LexiCloth.

Copyright © 2026 LexiCloth / Osheka Work.
