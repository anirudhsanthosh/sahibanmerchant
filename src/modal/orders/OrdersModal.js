import storage from "../../utils/localStorage";
import { SITE, API_URL, ORDERS, ORDER } from "../../config";
import { toQueryString } from "../../utils/serialize";

export default class OrdersModal {
  /**
   * key for store user data in local storage
   */
  static #baseKey = "ORDERS--";

  static get() {
    return storage.get(this.#baseKey);
  }
  static set(orders) {
    return storage.set(this.#baseKey, orders);
  }

  static getOrders({ auth, query = {} }) {
    const url = SITE + API_URL + ORDERS + "?" + toQueryString(query);

    return axios
      .get(url, {
        headers: {
          ...auth,
        },
      })
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        return { error };
      });
  }

  static getOrder({ id, auth }) {
    const url = SITE + API_URL + ORDER + id;
    return axios
      .get(url, {
        headers: {
          ...auth,
        },
      })
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        return { error };
      });
  }
}
