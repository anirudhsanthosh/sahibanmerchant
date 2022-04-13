import ProductView from "../../view/Product/ProductView";
import ProductModal from "../../modal/Product/ProductModal";
import UserModal from "../../modal/user/userModal";

import ProductsController from "../Products/ProductsController";

export default class ProductController {
  #config;
  #product;
  #view;
  constructor(config = {}) {
    if (config.constructor.name !== "Object") {
      throw new Error("config must be an object");
    }

    this.#config = config;
    this.#product = config.product;
    this.init();
  }

  init() {
    this.getProduct()
      .then((product) => {
        console.trace(product);
        this.#product = product;
        this.displayProduct(product);
      })
      .catch((err) => {
        //TODO deal with error while fetching product
        console.trace(err);
      });

    // instantiate new product view
    this.#view = new ProductView(this.configrationForView());
  }

  getProduct() {
    return new Promise((resolve, reject) => {
      const authHeader = UserModal.getAuthHeader();
      const productId = this.#config.product.id;
      const data = ProductModal.getProductWithId(authHeader, productId);
      // if unable to get data throw err
      if (data.error) return reject(data.error);
      // resolve data
      return resolve(data);
    });
  }

  configrationForView() {
    return {
      product: this.#product,
    };
  }

  displayProduct(product) {
    // format product object for view
    const config = this.formatProductForView(product);
    // disaplay prouct
    this.#view.displayProduct(config);
    //hide progrssbar
    this.#view.hideProgressBar();
  }

  formatProductForView(product) {
    const images = product.images.map((image) => image.src.large);
    const onSale = product.prices.on_sale;
    const regulaPrice = product.prices.regular_price / 100;
    const sellingPrice = product.prices.price / 100;
    const shortDescription = product.short_description; //.replace( /<\/?[^>]+(>|$)/g,);
    const offer = Math.floor(
      (1 - Number(sellingPrice) / Number(regulaPrice)) * 100
    );

    const description = product.description; //.replace(/<\/?[^>]+(>|$)/g, "");
    const featuredProduct = product.featured;
    const categories = this.formatCategories(product.categories);
    const crossSales = product.cross_sells;
    const parentId = product.parent_id;
    const cartButtonOnclick = this.cartButtonOnclick();
    const isPurchasable = product.add_to_cart.is_purchasable;

    return {
      id: product.id,
      name: product.name,
      featuredProduct,

      ///price
      onSale,
      regulaPrice,
      sellingPrice,
      offer,

      //description
      shortDescription,
      description,
      images,
      stock: product.stock,

      //categories
      categories,
      crossSales,
      //add to cart
      cartButtonOnclick,
      isPurchasable,
    };
  }

  cartButtonOnclick() {
    switch (this.#product.type) {
      case "simple":
        return this.addSimpleProductToCart();
        break;
      case "variable":
        return this.addVariableProductToCart();
        break;

      default:
        break;
    }
  }

  formatCategories(categories) {
    if (!categories || categories == "") return [];
    return categories.map((category) => {
      return {
        text: category.name,
        onClick: () => {
          new ProductsController({
            query: {
              title: category.name ?? "",
              category: category.id,
            },
          });
        },
      };
    });
  }

  addSimpleProductToCart() {
    // cart modal add simple product
    return () => console.log({ adddingSimpleProduct: this.#product });
  }
  addVariableProductToCart() {
    // cart modal add variable product

    return () => console.log({ addVariableProductToCart: this.#product });
  }
}
