import storage from "../../utils/localStorage";

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
}
