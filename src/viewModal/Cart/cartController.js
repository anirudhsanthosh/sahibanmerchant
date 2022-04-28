import CartModal from "../../modal/cart/cartModal";
import UserModal from "../../modal/user/userModal";
import CartView from "../../view/Cart/CartView";
import OrdersModal from "../../modal/Orders/OrdersModal";
import { decodeHtml, calculateDiscount } from "../../utils/sanitize";
import { toast } from "../../utils/notification";
import { updateCartCount } from "../Navigation/bottomNavigationController";
import CheckoutController from "../Checkout/CheckoutController";

import { CART_PAGE_ID } from "../../config";

export default class CartController {
  #view;
  #updating = false;
  constructor() {
    this.init();
    this.updateCart(); // cart data will be updated
    this.attachEvents();
  }

  // initiate cart
  /**
   * get data from cache if the cache is fresh which means lessthan 1 minut dont refresh
   */
  init() {
    const cart = CartModal.getCachedCart();
    const viewConfig = this.formatCartDataForView(cart);
    this.#view = new CartView(viewConfig);
  }

  formatCartDataForView(cart) {
    if (!cart || Object.keys(cart).length === 0) return false;
    console.log({ fromFormatForView: cart });

    // list of items
    const items = cart.items.map((item) => {
      //name
      const variationName = item?.variation.map((variation) => variation.value);
      let name = [item.name, ...variationName].join(" ");

      //price
      //sale price
      let salePrice = !isNaN(item.prices.sale_price)
        ? item.prices.sale_price / 10 ** item.prices.currency_minor_unit
        : null;

      // regular price
      let regularPrice = !isNaN(item.prices.regular_price)
        ? item.prices.regular_price / 10 ** item.prices.currency_minor_unit
        : null;
      let discount = null;

      if (
        !isNaN(salePrice) &&
        !isNaN(regularPrice) &&
        salePrice !== regularPrice
      )
        //discount
        discount = calculateDiscount(salePrice, regularPrice);
      else {
        salePrice = regularPrice;
        regularPrice = null;
      }

      // item remove button onclick
      const removeButtonOnclick = this.removeCartItem(item);

      // item count update button onclick
      const updateQuantity = this.updateQunatity(item);

      return {
        name,
        quantity: item.quantity,
        image: item?.images[0].thumbnail,
        type: item?.variation?.length !== 0,
        variation: item?.variation,
        salePrice,
        regularPrice,
        discount,
        removeButtonOnclick,
        updateQuantity,

        quantitylimit: item.quantity_limit,
        lineTotal: item?.totals?.line_total,
      };
    });

    // error noticess
    const errors = cart.errors.map((error) => {
      return decodeHtml(error.message);
    });

    // apply coupon call back
    const applyCoupon = this.applyCoupon();

    // applied coupons
    const appliedCoupons = cart.coupons.map((coupon) => {
      return {
        code: coupon.code,
        remove: () => {
          this.removeCoupon(coupon.code);
        },
      };
    });
    // checkout button click call back
    const checkout = () => this.checkout(cart);

    // total price shown at bottom of cart page
    const totalPrice =
      cart?.totals?.total_price / 10 ** cart.totals.currency_minor_unit;
    // total of items
    const totalItems =
      cart?.totals?.total_items / 10 ** cart.totals.currency_minor_unit;

    // total discount shown at bottom of cart page
    const totalDiscount =
      cart?.totals?.total_discount / 10 ** cart.totals.currency_minor_unit;
    // shipping amount
    const totalShipping =
      cart?.totals?.total_shipping / 10 ** cart.totals.currency_minor_unit;

    // rerender cart each time user views the cart when refocus on cart page
    const refreshCart = this.refreshCart();
    return {
      items,
      itemsCount: cart.items_count,
      errors,
      appliedCoupons,
      totalPrice,
      currency_prefix: cart.totals.currency_prefix,
      totalItems,
      totalDiscount,
      totalShipping,
      checkout,
      applyCoupon,
      refreshCart,
    };
  }

  updateQunatity(item) {
    const headers = this.getHeadersForCartRequest();

    return async (quantity = 0) => {
      return new Promise((resolve, reject) => {
        if (!quantity || quantity == 0 || isNaN(quantity))
          return reject({ message: `Quantity can't be 0` });

        const lowStockQuantity = item.low_stock_remaining ?? 0;
        if (item.quantity_limit - lowStockQuantity < quantity)
          return reject({
            message: `Available quantity is ${
              item.quantity_limit - lowStockQuantity
            }`,
          });

        CartModal.updateCartItem(item.key, quantity, headers)
          .then((res) => {
            this.updateCartData(res);
            resolve();
            toast(`${item.name}'s quantity has updated to ${quantity}.`);
            window.ajaxloader.hide();
          })
          .catch((error) => {
            reject(error);
            this.cartUpdateError(error.message);
            // toast(`Unable to update quantity of ${item.name} to "${quantity}".`);
          });
      });
    };
  }

  getHeadersForCartRequest() {
    return {
      ...UserModal.getAuthHeader(),
      "X-WC-Store-API-Nonce": UserModal.getNonce(),
    };
  }

  removeCartItem(item) {
    const headers = this.getHeadersForCartRequest();
    return async () => {
      window.ajaxloader.show();
      CartModal.removeFromCart(item.key, headers)
        .then((res) => {
          this.updateCartData(res);
          toast(`${item.name} removed from cart.`);
          window.ajaxloader.hide();
        })
        .catch((error) => {
          this.cartUpdateError(error.message);
          // toast(`Unable to remove ${item.name} from cart.`);
        });
    };
  }

  applyCoupon() {
    const headers = this.getHeadersForCartRequest();
    return async (code) => {
      window.ajaxloader.show();
      CartModal.applyCoupon(code, headers)
        .then((res) => {
          this.updateCartData(res);
          toast(`coupon "${code}" has applied.`);
          window.ajaxloader.hide();
        })
        .catch((error) => {
          this.cartUpdateError(error.message);
        });
    };
  }

  removeCoupon(code) {
    const headers = this.getHeadersForCartRequest();
    window.ajaxloader.show();
    CartModal.removeCoupon(code, headers)
      .then((res) => {
        this.updateCartData(res);
        toast(`coupon "${code}" removed from cart.`);
        window.ajaxloader.hide();
      })
      .catch((error) => {
        this.cartUpdateError(error.message);
      });
  }

  async checkout(cart) {
    // empty cart return
    if (cart?.items?.length < 1)
      return toast("Please fill the cart first.", 4000);
    // show loader
    window.ajaxloader.show();

    // chechout controller intantiation
    const checkout = new CheckoutController();

    //first request for checkout rest api and if it faild cancel the iab window

    let abortCheckout = false; // thi is used to avaoid execution of iab clossing error function
    let currentOrder = null; // this will get populated by the new order object;

    const headers = this.getHeadersForCartRequest();
    // data is not nessessory for get request
    const data = {
      billing_address: cart.billing_address,
      shipping_address: cart.shipping_address,
      payment_method: "razorpay",
    };

    // calling cart modal and check can perform checkout or not just like fetch preflight request
    CartModal.checkout(data, headers)
      .then((res) => {
        console.log({ checkoutData: res });
        if (res.error) throw new Error(res.error);
        currentOrder = res;
      })
      .catch((error) => {
        // when there is an error we need to destroy iab instatnce
        abortCheckout = true;
        checkout.destroy();
        toast(error.message, 4000);
        window.ajaxloader.hide();
      });

    // initializing checkout iab will be launched soon
    let checkoutResult;
    try {
      checkoutResult = await checkout.init();
      console.log({ checkoutResult });
    } catch (errorFromIab) {
      console.log({ errorFromIab });
    }

    if (abortCheckout) {
      toast("Checkout aborted", 4000);
      return window.ajaxloader.hide(); // if the request is aborted then exit the callback
    }
    // now we need to check the checkout result regardless of the iab output
    this.updateCart();

    // check the newly created order with server

    return;
  }
  // fetching live data from server
  updateCart() {
    if (this.#updating) return;
    this.#updating = true;
    this.#view?.showProgressBar();
    const headers = this.getHeadersForCartRequest();

    CartModal.get(headers)
      .then((res) => {
        this.updateCartData(res);
        this.#updating = false;
        window.ajaxloader.hide();
      })
      .catch((error) => {
        this.#updating = false;
        this.cartUpdateError(error.message);
      });
  }
  //setting new cart data to modal and view
  updateCartData(cart) {
    console.log({ fromUpdateCartFunction: cart });
    if (cart.error) throw new Error(cart.error);
    CartModal.set(cart); // update cart in storage
    updateCartCount(cart.items_count); // update iem count in bottom navigaton bar
    this.init(); // initilize the cart page again
    this.#view?.hideProgressBar();
  }
  // show errors in cart
  cartUpdateError(message) {
    toast(message, 4000);
    window.ajaxloader.hide();
    throw new Error(message);
  }

  refreshCart() {
    return () => {
      this.updateCart();
      this.init();
    };
  }

  // attach events with page

  attachEvents() {
    const cartPage = document.getElementById(CART_PAGE_ID);
    if (!cartPage) return;
    const refreshCart = this.refreshCart();
    const showEvent = (e) => {
      refreshCart();
    };

    const destroyEvent = (e) => {
      cartPage.removeEventListener("show", showEvent);
      cartPage.removeEventListener("destroy", destroyEvent);
    };
    cartPage.addEventListener("show", showEvent);
    cartPage.addEventListener("destroy", destroyEvent);
  }
}
