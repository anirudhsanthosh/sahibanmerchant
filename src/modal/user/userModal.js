import storage from "../../utils/localStorage";
import { isEmptyObject } from "../../utils/validator";

window.a = isEmptyObject;
export default class userModal {
  /**
   * key for store user data in local storage
   */
  static #baseKey = "USER--";
  static #authKey = this.#baseKey + "AUTH";
  static #basicDetail = this.#baseKey + "DETAILS";

  static get() {
    return storage.get(this.#basicDetail);
  }

  static set(user = {}) {
    if (isEmptyObject(user)) return storage.remove(this.#basicDetail);
    return storage.set(this.#basicDetail, user);
  }

  static setAuth(auth = {}) {
    if (isEmptyObject(auth)) return storage.remove(this.#authKey);
    return storage.set(this.#authKey, auth);
  }

  static getAuth() {
    return storage.get(this.#authKey);
  }

  static getAuthHeader() {
    let userAuth = storage.get(this.#authKey);
    return {
      Authorization:
        "Basic " + btoa(`${userAuth.username}:${userAuth.password}`),
    };
  }
}
