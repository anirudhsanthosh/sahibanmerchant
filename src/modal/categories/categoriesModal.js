import storage from "../../utils/localStorage";
import { isEmpty } from "validator";

export default class categoriesModal {
  /**
   * key for store user data in local storage
   */
  static #baseKey = "CATEGORIES--";
  static #ordered = "--ORDERES--";

  static get(id = null) {
    try {
      // if id is not present return all categories
      if (!id || isEmpty(id)) return storage.get(this.#baseKey);

      id = Number(id);
      const categories = storage.get(this.#baseKey);
      return categories.find((category) => category.id === id);
    } catch (e) {
      return { error: e };
    }
  }
  static getOrdered() {
    return storage.get(this.#baseKey + this.#ordered);
  }
  static set(categories) {
    const cats = categories;
    const sorted = {};
    const filtered = {};
    cats.map((cat) => {
      sorted[cat.id] = cat;
      if (!filtered[cat.parent]) filtered[cat.parent] = [];
      filtered[cat.parent].push(cat);
    });
    const formated = {};
    for (parent in filtered) {
      const name = sorted[parent]?.name ?? "Top Categories";

      formated[name] = filtered[parent];
    }
    storage.set(this.#baseKey + this.#ordered, formated);
    return storage.set(this.#baseKey, categories);
  }
}
