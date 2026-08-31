import Storage from "./storage.js";

const STORAGE_KEY = "lexicloth_orders";

class Orderservice {

    getOrders() {

        return Storage.get(STORAGE_KEY, []);

    }

    saveOrder(order) {

        const orders = this.getOrders();

        orders.push(order);

        Storage.set(STORAGE_KEY, orders);

    }

}

export default new Orderservice();