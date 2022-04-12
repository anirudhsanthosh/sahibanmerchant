import storage from "../../utils/localStorage";
import { isEmpty } from "validator";

export default class CategoriesModal {
  /**
   * key for store user data in local storage
   */
  static #baseKey = "CATEGORIES--";

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
  static set(categories) {
    return storage.set(this.#baseKey, categories);
  }
}
