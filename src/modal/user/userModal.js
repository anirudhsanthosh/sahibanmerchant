import {
  API_URL,
  SITE,
  USER,
  CREATE_USER,
  FORGOT_PASSWORD,
} from "../../config";
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
  static #nonce = this.#baseKey + "NONCE";

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

  static setNonce(nonce) {
    if (isEmptyObject(nonce)) return storage.remove(this.#nonce);
    return storage.set(this.#nonce, nonce);
  }
  static getNonce() {
    return storage.get(this.#nonce);
  }

  static update(user, headers) {
    const url = SITE + API_URL + USER;
    return axios
      .post(url, user, {
        headers: {
          ...headers,
        },
      })
      .then((res) => {
        this.set(res.data); // settign user data
        const auth = this.getAuth();
        console.log(auth);
        auth.username = res.data.login;
        console.log(auth);
        // this.setAuth(auth); // changing login details
        return res.data;
      })
      .catch((error) => {
        return { error };
      });
  }

  static register(user) {
    const url = SITE + API_URL + CREATE_USER;
    return axios
      .post(url, user)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        return { error };
      });
  }
  static forgotPassword(user) {
    const url = SITE + API_URL + FORGOT_PASSWORD;
    return axios
      .post(url, user)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        return { error };
      });
  }
}
