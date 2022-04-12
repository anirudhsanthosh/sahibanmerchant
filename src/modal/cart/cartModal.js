import { API_URL, SITE, CART_NODE } from "../../config";
import storage from "../../utils/localStorage";
export default class cart {
  static #countKey = "CART-COUNT";
  static #cartKey = "CART";

  static async get(auth) {
    try {
      const url = SITE + API_URL + CART_NODE;

      const data = await axios.get(url, {
        headers: {
          ...auth,
        },
      });

      storage.set(this.#countKey, data.data.item_count);
      storage.set(this.#cartKey, data.data);
      return data;
    } catch (e) {
      return { error: e };
    }
  }

  static setCartItemCount(itemCount = 0) {
    return storage.set(this.#countKey, itemCount);
  }
  static getCartItemCount() {
    return storage.get(this.#countKey);
  }
  static getCachedCartItemCount() {
    return storage.get(this.#countKey);
  }

  static getCachedCart() {
    return storage.get(this.#cartKey);
  }
}
