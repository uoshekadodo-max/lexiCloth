/**
 * =========================================================
 * LexiCloth Storage Service
 * ---------------------------------------------------------
 * A single service for handling browser localStorage.
 * Every part of the application (Cart, Wishlist, Theme, etc.)
 * should use this class instead of accessing localStorage
 * directly.
 * =========================================================
 */

export default class Storage {

    /**
     * Save data to localStorage.
     *
     * @param {string} key
     * @param {*} value
     */
    static set(key, value) {

        try {

            const data = JSON.stringify(value);

            localStorage.setItem(key, data);

        } catch (error) {

            console.error(`Storage Error (SET): ${key}`, error);

        }

    }

    /**
     * Get data from localStorage.
     *
     * @param {string} key
     * @param {*} defaultValue
     * @returns {*}
     */
    static get(key, defaultValue = null) {

        try {

            const data = localStorage.getItem(key);

            if (data === null) {

                return defaultValue;

            }

            return JSON.parse(data);

        } catch (error) {

            console.error(`Storage Error (GET): ${key}`, error);

            return defaultValue;

        }

    }

    /**
     * Remove one item from localStorage.
     *
     * @param {string} key
     */
    static remove(key) {

        localStorage.removeItem(key);

    }

    /**
     * Check if a key exists.
     *
     * @param {string} key
     * @returns {boolean}
     */
    static has(key) {

        return localStorage.getItem(key) !== null;

    }

    /**
     * Clear every item in localStorage.
     */
    static clear() {

        localStorage.clear();

    }

}