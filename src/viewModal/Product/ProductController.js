import ProductView from "../../view/Product/ProductView";
import ProductModal from "../../modal/Product/ProductModal";
import UserModal from "../../modal/user/userModal";
import CartModal from "../../modal/cart/cartModal";

import { SUPPORTED_PRODUCT_TYPES } from "../../config";
import { toast } from "../../utils/notification";

import ProductsController from "../Products/ProductsController";
import { updateCartCount } from "../Navigation/bottomNavigationController";

export default class ProductController {
  #config;
  #product;
  #view;
  #variations;
  #activeVariation;
  #activeAttributes;
  #parentImages;
  constructor(config = {}) {
    if (config.constructor.name !== "Object") {
      throw new Error("config must be an object");
    }

    this.#config = config;
    this.#product = config.product;
    // reject unsupported product types
    if (
      !SUPPORTED_PRODUCT_TYPES.includes(config.product.type) ||
      SUPPORTED_PRODUCT_TYPES.includes(config.product.type) < 0
    ) {
      throw new Error("unsupported product type");
    }
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

  // this is used to create a format for initial display
  //using the same for updation is waste of computation so resort to another
  formatProductForView(product) {
    const images = product.images.map((image) => image.src.large);
    this.#parentImages = images;
    const onSale = product.prices.on_sale;
    const type = product.type;

    // regular price

    let regulaPrice = product.prices.regular_price / 100;
    // if (type === "variable") regulaPrice = null;
    // selling price
    let sellingPrice = product.prices.price / 100;
    // if (type === "variable") sellingPrice = null;

    let offer = Math.floor(
      (1 - Number(sellingPrice) / Number(regulaPrice)) * 100
    );
    if (type === "variable") offer = null;

    const shortDescription = product.short_description;

    const priceFrom =
      product.prices.price_range.from === ""
        ? regulaPrice
        : product.prices.price_range.from / 100;
    const priceTo =
      product.prices.price_range.to === ""
        ? regulaPrice
        : product.prices.price_range.to / 100;

    const variationDiscount = null; //Math.floor((1 - Number(priceFrom) / Number(priceTo)) * 100);

    const description = product.description; //.replace(/<\/?[^>]+(>|$)/g, "");
    const featuredProduct = product.featured;
    const categories = this.formatCategories(product.categories);
    const crossSales = product.cross_sells;
    const parentId = product.parent_id;
    const cartButtonOnclick = this.cartButtonOnclick();
    const isPurchasable = product.add_to_cart.is_purchasable;
    const specificationAttributes = this.formatSpecificationAttrbutes(
      product.attributes
    );
    return {
      id: product.id,
      name: product.name,
      featuredProduct,
      type: product.type,

      ///price
      onSale,
      regulaPrice,
      sellingPrice,
      offer,

      // for variable products those are on sale has a from - to proce range show thatinsted of fixed price

      priceFrom,
      priceTo,
      variationDiscount,

      //description
      shortDescription,
      description,
      images,
      stock: product.stock,
      specificationAttributes,
      //categories
      categories,
      crossSales,

      // /variations
      variations: this.formatVariationsForDisplay(
        product.variations,
        product.attributes
      ),
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
    return async () => {
      if (!this.#product.add_to_cart.is_purchasable)
        return ons.notification.toast("Sorry, product unavailable.", {
          timeout: 2000,
        });
      // this.addToCart(this.#product.add_to_cart.rest_url);
      this.addToCart(this.#product.id);
    };
  }

  addVariableProductToCart() {
    // cart modal add variable product
    return async () => {
      if (!this.#activeVariation)
        return ons.notification.toast("please select a variation ", {
          timeout: 2000,
        });
      if (!this.#activeVariation.add_to_cart.is_purchasable)
        return ons.notification.toast("Sorry, product unavailable.", {
          timeout: 2000,
        });

      // this.addToCart(this.#activeVariation.add_to_cart.rest_url);
      this.addToCart(this.#activeVariation.id, true);
    };
  }

  async addToCart(id, variation = "") {
    //TODO refactor this ,error handling,args handling
    const authHeader = UserModal.getAuthHeader();
    const nonce = UserModal.getNonce();
    authHeader["X-WC-Store-API-Nonce"] = nonce;
    window.ajaxloader.show();
    let args = [this.#product.id, authHeader];
    if (variation)
      args = [this.#activeVariation.id, authHeader, this.#activeAttributes];

    CartModal.addTocartWithWcEndpoind(...args)
      .then((cart) => {
        if (cart.error) throw new Error(cart.error);
        // if (cart?.notices?.success) toast(cart?.notices?.success[0]);
        toast(`${this.#product.name} added to cart.`);
        if (cart.items_count) {
          updateCartCount(cart.items_count);
          CartModal.set(cart);
        }
        window.ajaxloader.hide();
      })
      .catch((e) => {
        console.error(e);
        toast(`Unable to add ${this.#product.name} to cart.`);
        window.ajaxloader.hide();
      });

    return;
  }

  /**
   * this function will sort adnd filter then format all the attributes of variable product
   * and return array of attributes used for variations
   */
  formatAttributes(attributes = {}) {
    const formattedAttributes = [];
    for (let [key, value] of Object.entries(attributes)) {
      if (!value.used_for_variation) continue;
      const attributeName = value.name;
      const attributeKey = key;
      const attributeOptions = value.options;
      formattedAttributes.push({
        attributeName,
        attributeKey,
        attributeOptions,
      });
    }

    return formattedAttributes;
  }

  // these are the attributes witch are not used for variation

  formatSpecificationAttrbutes(attributes) {
    const formattedAttributes = [];
    for (let [key, value] of Object.entries(attributes)) {
      if (!value.is_attribute_visible || value.used_for_variation) continue;

      const name = value.name;
      let attrValues = [];
      for (let [key, value] of Object.entries(value.options)) {
        attrValues.push(value);
      }
      formattedAttributes.push({
        name,
        value: attrValues.join(","),
      });
    }
    return formattedAttributes;
  }

  /**
   * this will format all variations
   * filter non sellables
   * and return only the sellable variations, this will be used to display variations,
   * this function will mark the default variation as active or first variation will be set as active
   *
   * @param {*} variations
   * @param {*} attributes
   * @param {*} defaultVariationAtributes
   * @returns Array of variations
   */
  formatVariationsForDisplay(
    variations = [],
    parentAttributes = {},
    defaultVariationAtributes = []
  ) {
    if (!variations || variations == "" || variations.length < 1) return [];
    // filter non sellable variations
    const sellableVariations = variations.filter((variation) => {
      return variation?.add_to_cart?.is_purchasable;
    });

    const formatedVariations = sellableVariations.map((variation) => {
      // prices
      // const price = variation.prices.price ;
      const regular_price = variation.prices.regular_price;
      const onSale = variation.prices.on_sale;
      const salePrice = variation.prices.sale_price;

      /// attributes
      const attributesForAddingToCart = [];
      const attributes = [];
      for (let [key, value] of Object.entries(variation.attributes)) {
        const attributeName = parentAttributes[key].name;
        const attributeKey = key;
        const attributeValue = value;
        attributes.push({ attributeName, attributeKey, attributeValue });
        attributesForAddingToCart.push({
          attribute: attributeName,
          value: attributeValue,
        });
      }

      // onclick
      const onclick = this.variationCardOnclick(
        variation,
        attributesForAddingToCart
      );

      const formated = {
        active: false,
        id: variation.id,
        description: variation.description,
        image: variation.featured_image.large,
        rest_url: variation.add_to_cart.rest_url,
        salePrice: onSale ? salePrice / 100 : regular_price / 100,
        regularPrice: onSale ? regular_price / 100 : null,
        discount: onSale
          ? Math.floor((1 - salePrice / regular_price) * 100)
          : null,
        attributes,
        onclick,
      };
      return formated;
    });

    //if we want  to set default variation

    // if (sellableVariations.length > 0) {
    //   this.#activeVariation = sellableVariations[0];
    //   formatedVariations[0].active = true;
    // }

    // return sellableVariations;
    return formatedVariations;
  }

  variationCardOnclick(variation, attributes) {
    return async () => {
      return new Promise((resolve, reject) => {
        this.#activeVariation = variation;
        this.#activeAttributes = attributes;

        this.updateViewWithNewVariationSettings()
          .then((res) => resolve(res))
          .catch((e) => {
            console.trace(e);
            reject(e);
          });
      });
    };
  }

  updateViewWithNewVariationSettings() {
    return new Promise((resolve, reject) => {
      const config = this.formatVariationAndProductForUpdation();
      this.#view
        .updateView(config)
        .then((res) => resolve(res))
        .catch((e) => reject(e));
    });
  }

  formatVariationAndProductForUpdation() {
    // price
    const salePrice = this.#activeVariation.prices.price / 100;
    const onSale = this.#activeVariation.prices.on_sale;
    const regularPrice = onSale
      ? this.#activeVariation.prices.regular_price / 100
      : null;
    const offer = onSale
      ? Math.floor((1 - salePrice / regularPrice) * 100)
      : null;

    //images
    let images = this.#parentImages;
    if (this.#activeVariation.featured_image) {
      images = Array.isArray(this.#activeVariation.featured_image.large)
        ? [...this.#activeVariation.featured_image.large, ...images]
        : [this.#activeVariation.featured_image.large, ...images];
    }
    // attributes
    let attributes =
      this.formatSpecificationAttrbutes(this.#product.attributes) ?? [];
    const variationsAttributes = [];
    const titleExtentions = [];
    for (let [key, value] of Object.entries(this.#activeVariation.attributes)) {
      variationsAttributes.push({
        name: this.#product.attributes[key].name,
        value,
      });
      titleExtentions.push(value);
    }
    const specificationAttributes = [...attributes, ...variationsAttributes];

    //title
    const title = `${this.#product.name} ${titleExtentions.join(" ")} `;

    //description

    let description = this.#product.description;
    if (
      this.#activeVariation.description &&
      this.#activeVariation.description !== ""
    )
      description = this.#activeVariation.description;

    return {
      salePrice,
      onSale,
      regularPrice,
      offer,
      images,
      specificationAttributes,
      title,
      description,
    };
  }
}
