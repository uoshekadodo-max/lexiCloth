import products from "../data/data.js";

const RECENT_KEY = "recentProducts";
class ProductRepository {

    getAll() {

        return [...products];

    }

    getById(id) {

        return products.find(product => product.id === Number(id));

    }

    getFeatured() {

        return products.filter(product => product.featured);

    }

    getBestSellers() {

        return products.filter(product => product.bestSeller);

    }

    getNewArrivals() {

        return products.filter(product => product.newArrival);

    }

    getByCategory(category) {

        return products.filter(product =>

            product.category.toLowerCase() === category.toLowerCase()

        );

    }

    search(keyword) {

        const query = keyword.trim().toLowerCase();

        return products.filter(product =>

            product.name.toLowerCase().includes(query) ||

            product.category.toLowerCase().includes(query) ||

            product.brand.toLowerCase().includes(query)

        );

    }
  

getRecentlyViewed() {

    const ids = JSON.parse(

        localStorage.getItem(RECENT_KEY)

    ) || [];

    return ids

        .map(id => this.getById(id))

        .filter(Boolean);

}

saveRecentlyViewed(productId) {

    let ids = JSON.parse(

        localStorage.getItem(RECENT_KEY)

    ) || [];

    ids = ids.filter(id => id !== productId);

    ids.unshift(productId);

    ids = ids.slice(0, 8);

    localStorage.setItem(

        RECENT_KEY,

        JSON.stringify(ids)

    );

}

}

// const RECENT_KEY = "recentlyViewed";


const productRepository = new ProductRepository();

export default productRepository;


