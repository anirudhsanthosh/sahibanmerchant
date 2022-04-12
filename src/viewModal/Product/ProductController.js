export default class ProductController {
  #config;
  constructor(config = {}) {
    if (config.constructor.name !== "Object") {
      throw new Error("config must be an object");
    }
    console.log(config);
    this.#config = config;
  }
}
