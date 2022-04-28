import storage from "../../utils/localStorage";

export default class searchModal {
  static #key = "--SEARCH--";
  static get() {
    const data = storage.get(this.#key);
    return !data ? [] : data;
  }
  static set(data) {
    return storage.set(this.#key, data);
  }
}
