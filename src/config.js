// api endpoints

export let SITE = "http://192.168.80.121/wordpress/";

export const changeSite = (site) => {
  SITE = `http://${site}/wordpress/`;
};
export const OFFER_NODE = "mam/v1/offers";
export const CATEGORIES_NODE = "wc/store/products/categories";
export const API_URL = "wp-json/";
export const LOGIN_NODE = "wp/v2/app/verify-user"; //"cocart/v2/login/";
export const CART_NODE = "cocart/v2/cart/";
export const PRODUCTS_NODE = "wc/store/products";
export const PRODUCT_NODE = "cocart/v2/products/";

export const REMOVE_ITEM_FROM_CART = "wc/store/cart/remove-item";
export const UPDATE_CART_ITEM_FROM = "wc/store/cart/update-item";

export const ADD_ITEM = "wc/store/cart/add-item";
export const APPLY_COUPON = "wc/store/cart/apply-coupon";
export const REMOVE_COUPON = "wc/store/cart/remove-coupon";
export const CHECKOUT = "wc/store/checkout";

//global
export const ONS_NAVIGATOR_ID = "navigator";
export const SUPPORTED_PRODUCT_TYPES = ["simple", "variable"];

// homepage

export const OFFER_SLIDER = "offerSlider-flex";
export const HOMEPAGE_CATEGORY_SECTION_ID = "catagoriesShowcase";
export const HOMEPAGE_TOP_CATEGORY_SECTION_ID_ = "topCatagoriesShowcase";
export const HOMEPAGE_CONTENT_ELEMENT_SELECTOR = "#offfer-cards-wrapper";

// category page

export const CATEGORY_PAGE_DISPLAY_ROOT_ID = "catagoriesPageDisplay";

// search page
export const SEARCH_PAGE_INPUT_ID = "search-input";
export const SEARCH_PAGE_AJAX_RESULT_DISPLAY_ID = "search-ajax-result";
export const SEARCH_PAGE_CLEAR_BUTTON_ID = "searchpageClearButton";

// bottom navigation

export const cartCountBadgeId = "cart-count";

//cart page
export const CART_PAGE_DISPLAY_ROOT_ID = "cart-display";

// pages
export const PAGES = {
  home: "pages/home.html",
  login: "pages/login.html",
  catagories: "pages/catagories.html",
  search: "pages/search.html",
  cart: "pages/cart.html",
  account: "pages/account.html",
};

// configeration
export const SEARCH_HISTORY_MAX_LENGTH = 10;
export const DEFAULT_AVATAR =
  "https://2.gravatar.com/avatar/8fe5241bef4843ce46d7ed9efc01cadf?s=96&d=mm&r=g";

//products
export const MAX_NUMBER_OF_PRODUCTS_PER_PAGE = 10;
export const PRODUCT_STOCK_STATUS_AVAILABLE = "instock";

export const PRODUCT_REQUEST_ORDER_TYPES = ["asc", "desc"];
export const PRODUCT_REQUEST_ORDER_FIELDS = [
  // "date",
  // "id",
  // "include",
  // "title",
  // "slug",
  // "menu_order",
  // "comment_count",
  {
    id: "popularity",
    label: "Popularity",
    order: "desc",
  },
  {
    id: "modified",
    label: "Newest First",
    order: "desc",
  },
  {
    id: "rating",
    label: "Rating",
    order: "desc",
  },
  {
    id: "price",
    label: "Price- Low to High",
    order: "asc",
  },
  {
    id: "price",
    label: "Price- High to Low",
    order: "desc",
  },
];
