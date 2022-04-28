export default class Navigator {
  #navigator;
  constructor(navigator_id) {
    if (!navigator_id) throw new Error("provide a valid id");
    try {
      this.#navigator = document.getElementById(navigator_id);
    } catch (e) {
      throw new Error("provide a valid id, cannot get element from this id");
    }
  }

  push(page, options = {}) {
    return this.#navigator.bringPageTop(page, options);
  }
  pop(options = {}) {
    return this.#navigator.popPage(options);
  }
  reset(page, options = {}) {
    if (page) return this.#navigator.resetToPage(page, options);
  }
  remove(id, options = {}) {
    return this.#navigator.removePage(id, options);
  }

  get topPage() {
    return this.#navigator.topPage;
  }
  get pages() {
    return this.#navigator.pages;
  }
}
