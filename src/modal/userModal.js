import storage from "../utils/localStorage";

export default class userModal {
  static #baseKey = "USER--";
  static #authKey = this.#baseKey + "AUTH";
  static #basicDetail = this.#baseKey + "DETAILS";
  static get() {
    return storage.get(this.#basicDetail);
  }
  static set(user) {
    return storage.set(this.#basicDetail, user);
  }
  static setAuth(auth = {}) {
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
