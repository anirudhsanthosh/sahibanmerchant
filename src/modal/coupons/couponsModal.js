import storage from "../../utils/localStorage";

export default class CouponsModal {
  /**
   * key for store user data in local storage
   */
  static #baseKey = "COUPONS--";

  static get() {
    return storage.get(this.#baseKey);
  }
  static set(coupons) {
    return storage.set(this.#baseKey, coupons);
  }
}
