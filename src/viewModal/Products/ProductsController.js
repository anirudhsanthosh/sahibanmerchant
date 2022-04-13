import {
  MAX_NUMBER_OF_PRODUCTS_PER_PAGE,
  PRODUCT_STOCK_STATUS_AVAILABLE,
  PRODUCT_REQUEST_ORDER_TYPES,
  PRODUCT_REQUEST_ORDER_FIELDS,
} from "../../config";

import productController from "../Product/ProductController";

import ProductsModal from "../../modal/products/productsModal";
import UserModal from "../../modal/user/userModal";

import ProductsView from "../../view/products/ProductsView";
/**
 * this conntrolls all products screen and its components
 *
 * deals display of products, sorting, filtering, searching and pagination
 *
 * basically
 * {
 *  product : some products,  [priority 2]
 * categories = some categories,  [priority 3]
 * search : search term,  [priority 1]
 * }
 *posssible query terms
 * {
 *
 *[
  context,
  page,
  per_page,
  search,
  after,
  before,
  date_column,
  exclude,
  include,
  offset,
  order,
  orderby,
  parent,
  parent_exclude,
  type,
  sku,
  featured,
  category,
  category_operator,
  tag,
  tag_operator,
  on_sale,
  min_price,
  max_price,
  stock_status,
  attributes,
  attribute_relation,
  catalog_visibility,
  rating,
];
 *
 * }
 *
 */

export default class ProductsController {
  #config;
  #title;
  #page = 1;
  #order = PRODUCT_REQUEST_ORDER_TYPES[1];
  #orderBy = "popularity";
  #products = [];
  #view;
  #isLoadingNow = false;

  constructor(config = {}) {
    if (config.constructor.name !== "Object") {
      throw new Error("config must be an object");
    }
    console.log(config);
    this.#config = config;
    this.#title = config?.query?.title ?? "";
    this.init();
  }

  init() {
    this.getProducts();

    // configration for view
    const configForView = {
      sortMenuItems: this.formatSortMenuItems(),
      title: this.#title,
      onInfinateScroll: this.onInfinateScroll(),
    };
    // instatiate view with config
    this.#view = new ProductsView(configForView);
  }

  #formatQuery() {
    let query = {
      per_page: MAX_NUMBER_OF_PRODUCTS_PER_PAGE,
      page: this.#page,
      order: this.#order,
      orderby: this.#orderBy,
      stock_status: PRODUCT_STOCK_STATUS_AVAILABLE,
    };

    if (
      !this.#config?.query ||
      this.#config?.query.constructor.name !== "Object"
    )
      return query;
    for (const [key, value] of Object.entries(this.#config.query)) {
      query[key] = value;
    }
    return query;
  }

  getProducts(append = false) {
    return new Promise((resolve, reject) => {
      //check any request is pending or not
      if (this.#isLoadingNow) reject();
      /// set loading status to true
      this.#isLoadingNow = true;
      // show progres bar if this is a new request
      // if(!append)
      Promise.resolve(this.#view).then(() => {
        this.#view.showProgressBar();
      });

      // format current query
      const query = this.#formatQuery();
      console.log(query);
      // get auth header from modal
      const authHeader = UserModal.getAuthHeader();

      //get products from server
      ProductsModal.getProducts(authHeader, query).then((res) => {
        if (res.error) {
          console.log(res.error);
          //TODO show error
          reject(res.error);
        }

        // hide progressbar
        Promise.resolve(this.#view).then(() => {
          this.#view.hideProgressBar();
        });

        // set loading status to false
        this.#isLoadingNow = false;

        // clear view and add products
        if (!append) {
          this.#products = [...res];
          const displayed = this.displayProducts(res);
          if (displayed) return resolve(res);
          return reject(res);
        }

        // append products to view
        this.#products = [...this.#products, ...res];
        const displayed = this.appendProducts(res);
        if (displayed) return resolve(res);
        return reject(res);
      });
    });
  }

  #resetProducts() {
    this.#products = [];
  }

  increasePageCount() {
    return this.#page++;
  }

  displayProducts(products) {
    // format products
    const formated = this.#formatProductForProductCard(products);
    // a promis will be returned from the view
    const added = this.#view.addProducts(formated, true); /// true for clear content
    return added;
  }

  appendProducts(products) {
    console.log(products);
    const formated = this.#formatProductForProductCard(products);
    // a promis will be returned from the view
    const added = this.#view.addProducts(formated, false); /// true for clear content.
    return added;
  }

  #formatProductForProductCard(products) {
    if (!products || !Array.isArray(products) || products.length === 0)
      return [];

    return products.map((product) => {
      const gotoProductPage = () => {
        const config = {
          product,
        };
        new productController(config);
      };

      // config for product

      const regularPrice = product.prices.regular_price / 100;
      const selePrice = product.prices.regular_price / 100;
      const discountInPercentage =
        100 - Math.floor((selePrice / regularPrice) * 100);
      const formattedProduct = {
        title: product.name,
        onSale: product.on_sale,
        regularPrice,
        selePrice,
        image: product?.images?.[0]?.thumbnail,
        discountInPercentage,
        onclick: gotoProductPage,
      };

      return formattedProduct;
    });
  }

  #setOrderby(orderBy = "popularity") {
    this.#orderBy = orderBy;
  }

  formatSortMenuItems() {
    const items = PRODUCT_REQUEST_ORDER_FIELDS;
    const formatted = items.map((item) => {
      const onclick = () => {
        //if a request is being procccessing return false
        if (this.#isLoadingNow) return false;

        // set sort by property
        this.#setOrderby(item.id);
        // set order asc or desc - useful when user coose low to high or high to low prices
        this.#order = item.order;
        // remove all products
        this.#resetProducts();
        // reset page count to 1 else the modal will fetch some othe page and result will be worse
        this.#resetPage();
        // get all products
        this.getProducts();
        return true;
      };

      const selected = this.#orderBy === item.id;
      return {
        selected,
        ...item,
        onclick,
      };
    });
    return formatted;
  }

  #resetPage() {
    this.#page = 1;
  }

  onInfinateScroll() {
    return (scrollingDoneCallback) => {
      // return if previous loading is not finished

      if (this.#isLoadingNow) return false;
      this.increasePageCount();
      this.getProducts(true)
        .then(() => setTimeout(() => scrollingDoneCallback(), 1000))
        .catch((e) => () => setTimeout(() => scrollingDoneCallback(), 1000));
    };
  }
}
