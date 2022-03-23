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

  push(page) {
    return this.#navigator.bringPageTop(page);
  }
  pop() {
    return this.#navigator.popPage();
  }
  reset(page) {
    if (page) return this.#navigator.resetToPage(page);
  }
}
