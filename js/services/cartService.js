
import Storage from "./storage.js";
import { CONFIG } from "../core/config.js";


class cart {

    constructor() {

        this.items = Storage.get(
            CONFIG.STORAGE.CART,
            []
        );

    }


    save() {

        Storage.set(
            CONFIG.STORAGE.CART,
            this.items
        );

    }


    notify() {

        document.dispatchEvent(

            new CustomEvent("cartUpdated", {

                detail: {

                    count: this.count(),

                    total: this.total()

                }

            })

        );

    }


    getItems() {

        return [...this.items];

    }


    add(
        product,
        quantity = 1,
        size = null,
        color = null
    ) {

        const existingItem = this.items.find(item =>

            item.id === product.id &&

            item.size === size &&

            item.color === color

        );


        if (existingItem) {

            existingItem.quantity += quantity;

        } else {

            this.items.push({

                ...product,

                quantity,

                size,

                color

            });

        }


        this.save();

        this.notify();

    }


   
   remove(id, size, color) {

    this.items = this.items.filter(item => !(

        String(item.id) === String(id) &&

        String(item.size ?? "") === String(size ?? "") &&

        String(item.color ?? "") === String(color ?? "")

    ));

    this.save();

    this.notify();

}



    updateQuantity(
        id,
        size,
        color,
        quantity
    ) {

        const item = this.items.find(item =>

            item.id === id &&

            item.size === size &&

            item.color === color

        );


        if (!item) return;


        item.quantity = Number(quantity);


        if (item.quantity <= 0) {

            this.remove(
                id,
                size,
                color
            );

            return;

        }


        this.save();

        this.notify();

    }


    count() {

        return this.items.reduce(

            (total, item) => {

                return total + (
                    Number(item.quantity) || 0
                );

            },

            0

        );

    }


    total() {

        return this.items.reduce(

            (total, item) => {

                return total + (

                    (Number(item.price) || 0) *

                    (Number(item.quantity) || 0)

                );

            },

            0

        );

    }


    clear() {

        this.items = [];

        this.save();

        this.notify();

    }

}


const cartService = new cart();

export default cartService;

