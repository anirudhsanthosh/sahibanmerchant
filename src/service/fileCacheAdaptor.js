import localforage from "localforage";
export default class FileCache {
  #forgeStore = this.#createLocalforgeInstance();
  constructor({ resolve, reject }) {
    resolve(this);
  }
  get(key) {
    return new Promise((resolve, reject) => {
      this.isCached(key)
        .then((value) => {
          if (value === null) throw new Error("Not cached");
          resolve(this.#resolveUrl(value));
        })
        .catch(() => this.#getFile(key))
        .then((imageBlob) => {
          resolve(this.#resolveUrl(imageBlob));
          this.#forgeStore.setItem(key, imageBlob);
        })
        .catch((error) => reject(error));
    });
  }

  isCached(key) {
    return this.#forgeStore.getItem(key).then((value) => value);
  }

  #resolveUrl(blob) {
    return URL.createObjectURL(blob);
  }

  #createLocalforgeInstance() {
    const forageStore = localforage.createInstance({
      // Prefix all storage keys to prevent conflicts
      name: "Sahiban",
    });
    return forageStore;
  }

  #getFile(key) {
    return fetch(key)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not OK");
        }
        return response.blob();
      })
      .catch((error) => {
        throw new Error(error);
      });
  }
}
