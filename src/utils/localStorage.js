import jsonHandler from "./json";
export default class storage {
  static #baseKey = "SAHIBAN_MERCHANT----";
  constructor() {}

  static #get(key) {
    let data = localStorage.getItem(this.#baseKey + key);
    if (!data) return false;
    let parsedData = jsonHandler.parse(data);
    if (!parsedData) return false;
    return parsedData.value ? parsedData.value : undefined;
  }

  static get(key) {
    return this.#get(key);
  }

  static #set(key, data) {
    let newData = {
      value: data,
    };
    let newStringedObj = jsonHandler.stringify(newData);

    if (!newStringedObj) return false;
    return localStorage.setItem(this.#baseKey + key, newStringedObj);
  }
  static set(key, data) {
    return this.#set(key, data);
  }
}
