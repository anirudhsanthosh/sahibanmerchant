import storage from "../../utils/localStorage";

export default class OffersModal {
  /**
   * key for store user data in local storage
   */
  static baseKey = "OFFERS--";

  static get() {
    return storage.get(this.baseKey);
  }
  static set(offers) {
    return storage.set(this.baseKey, offers);
  }
}
