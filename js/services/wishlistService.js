import Storage from "../Storage.js";
import { CONFIG } from "../core/config.js";

class WishlistService {

    constructor() {

        this.storageKey = CONFIG.STORAGE.WISHLIST;

    }

    getItems() {

        return Storage.get(this.storageKey, []);

    }

    save(items) {

        Storage.set(this.storageKey, items);

    }

    has(productId) {

        return this.getItems().some(

            item => Number(item.id) === Number(productId)

        );

    }

    add(product) {

        const items = this.getItems();

        if (this.has(product.id)) return;

        items.push(product);

        this.save(items);

    }

    remove(productId) {

        const items = this.getItems().filter(

            item => Number(item.id) !== Number(productId)

        );

        this.save(items);

    }

    toggle(product) {

        if (this.has(product.id)) {

            this.remove(product.id);

        } else {

            this.add(product);

        }

    }

    count() {

        return this.getItems().length;

    }

    clear() {

        this.save([]);

    }

}

export default new WishlistService();