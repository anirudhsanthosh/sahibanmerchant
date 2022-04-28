import storage from "../../utils/localStorage";
import { SITE, API_URL, ORDERS } from "../../config";

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

  static getOrder({ id, auth }) {
    const url = SITE + API_URL + ORDERS;
    return axios
      .get(url, {
        params: { id },
        headers: {
          ...auth,
        },
      })
      .then((res) => res.data)
      .catch((error) => {
        error;
      });
  }
}
