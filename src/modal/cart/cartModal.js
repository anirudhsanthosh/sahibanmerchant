import {
  API_URL,
  SITE,
  CART_NODE,
  REMOVE_ITEM_FROM_CART,
  UPDATE_CART_ITEM_FROM,
  APPLY_COUPON,
  REMOVE_COUPON,
  CHECKOUT,
  ADD_ITEM,
} from "../../config";
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

  static set(cart) {
    if (!cart) return;
    storage.set(this.#countKey, cart.items_count);
    cart.created = new Date();
    return storage.set(this.#cartKey, cart);
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

  static async addTocartWithWcEndpoind(id, auth, variation) {
    const url = SITE + API_URL + ADD_ITEM;
    const body = {
      id,
      quantity: 1,
    };
    if (variation) {
      body.variation = variation;
    }

    try {
      const data = await axios.post(url, body, {
        headers: {
          ...auth,
        },
      });

      return data.data;
    } catch (e) {
      return { error: e };
    }
  }
  static async addToCart(url = null, auth) {
    if (url) return this.addToCartWithUrl(url, auth);
  }
  static async addToCartWithUrl(url, auth) {
    try {
      const data = await axios.post(
        url,
        {},
        {
          headers: {
            ...auth,
          },
        }
      );

      return data.data;
    } catch (e) {
      return { error: e };
    }
  }

  static async removeFromCart(key, headers) {
    const url = SITE + API_URL + REMOVE_ITEM_FROM_CART;
    try {
      const data = await axios.post(
        url,
        {
          key,
        },
        {
          headers: {
            ...headers,
          },
        }
      );

      return data.data;
    } catch (e) {
      return { error: e };
    }
  }

  static async updateCartItem(key, quantity, headers) {
    const url = SITE + API_URL + UPDATE_CART_ITEM_FROM;
    try {
      const data = await axios.post(
        url,
        {
          key,
          quantity,
        },
        {
          headers: {
            ...headers,
          },
        }
      );

      return data.data;
    } catch (e) {
      return { error: e };
    }
  }
  static async applyCoupon(code, headers) {
    const url = SITE + API_URL + APPLY_COUPON;
    try {
      const data = await axios.post(
        url,
        {
          code,
        },
        {
          headers: {
            ...headers,
          },
        }
      );

      return data.data;
    } catch (e) {
      console.error({ e });
      if (!e.response) return { error: e.message };
      if (e?.response?.data?.message)
        return { error: e?.response?.data?.message };
      return { error: "Faild to apply Coupon" };
    }
  }
  static async removeCoupon(code, headers) {
    const url = SITE + API_URL + REMOVE_COUPON;
    try {
      const data = await axios.post(
        url,
        {
          code,
        },
        {
          headers: {
            ...headers,
          },
        }
      );

      return data.data;
    } catch (e) {
      console.error({ eFromModal: e });
      if (!e.response) return { error: e.message };
      if (e?.response?.data?.message)
        return { error: e?.response?.data?.message };
      return { error: "Faild to apply Coupon" };
    }
  }

  static async checkout(requestdata, headers) {
    const url = SITE + API_URL + CHECKOUT;
    try {
      const data = await axios.get(
        url,
        // {
        //   ...requestdata,
        // },
        {
          headers: {
            ...headers,
          },
        }
      );

      return data.data;
    } catch (e) {
      console.error({ eFromModal: e });
      if (!e.response) return { error: e.message };
      if (e?.response?.data?.message)
        return { error: e?.response?.data?.message };
      return { error: "Faild to apply Coupon" };
    }
  }
}
