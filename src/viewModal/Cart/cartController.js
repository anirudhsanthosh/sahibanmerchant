import CartModal from "../../modal/cart/cartModal";
import UserModal from "../../modal/user/userModal";
import CartView from "../../view/Cart/CartView";
import { decodeHtml, calculateDiscount } from "../../utils/sanitize";
import { toast } from "../../utils/notification";
import { updateCartCount } from "../Navigation/bottomNavigationController";
import CheckoutController from "../Checkout/CheckoutController";

export default class CartController {
  constructor() {
    this.init();
  }

  // initiate cart
  /**
   * get data from cache if the cache is fresh which means lessthan 1 minut dont refresh
   */
  init() {
    const cart = CartModal.getCachedCart();
    const viewConfig = this.formatCartDataForView(cart);
    const view = new CartView(viewConfig);
  }

  formatCartDataForView(cart) {
    console.log(cart);

    const items = cart.items.map((item) => {
      //name
      const variationName = item?.variation.map((variation) => variation.value);
      let name = [item.name, ...variationName].join(" ");

      //price
      let salePrice = !isNaN(item.prices.sale_price)
        ? item.prices.sale_price / 10 ** item.prices.currency_minor_unit
        : null;
      let regularPrice = !isNaN(item.prices.regular_price)
        ? item.prices.regular_price / 10 ** item.prices.currency_minor_unit
        : null;
      let discount = null;

      if (
        !isNaN(salePrice) &&
        !isNaN(regularPrice) &&
        salePrice !== regularPrice
      )
        discount = calculateDiscount(salePrice, regularPrice);
      else {
        salePrice = regularPrice;
        regularPrice = null;
      }

      const removeButtonOnclick = this.removeCartItem(item);
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

    const errors = cart.errors.map((error) => {
      return decodeHtml(error.message);
    });

    const applyCoupon = this.applyCoupon();
    const appliedCoupons = cart.coupons.map((coupon) => {
      return {
        code: coupon.code,
        remove: () => {
          this.removeCoupon(coupon.code);
        },
      };
    });

    const checkout = () => this.checkout(cart);

    const totalPrice =
      cart?.totals?.total_price / 10 ** cart.totals.currency_minor_unit;

    const totalItems =
      cart?.totals?.total_items / 10 ** cart.totals.currency_minor_unit;
    const totalDiscount =
      cart?.totals?.total_discount / 10 ** cart.totals.currency_minor_unit;
    const totalShipping =
      cart?.totals?.total_shipping / 10 ** cart.totals.currency_minor_unit;

    return {
      items,
      errors,
      applyCoupon,
      appliedCoupons,
      totalPrice,
      currency_prefix: cart.totals.currency_prefix,
      checkout,
      totalItems,
      totalDiscount,
      totalShipping,
    };
  }

  updateQunatity(item) {
    const headers = this.getHeadersForCartRequest();
    return async (quantity = 0) => {
      if (!quantity) return null;
      window.ajaxloader.show();

      CartModal.updateCartItem(item.key, quantity, headers)
        .then((res) => {
          if (res.error) throw new Error(res.error);
          CartModal.set(res);
          updateCartCount(res.items_count);
          toast(`${item.name} quantity has updated to "${quantity}".`);
          //TODO refactor and improve
          this.init();
          window.ajaxloader.hide();
        })
        .catch((error) => {
          toast(`Unable to update quantity of ${item.name} to "${quantity}".`);
          window.ajaxloader.hide();
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
          if (res.error) throw new Error(res.error);
          CartModal.set(res);
          updateCartCount(res.items_count);
          toast(`${item.name} removed from cart.`);
          //TODO refactor and improve
          this.init();
          window.ajaxloader.hide();
        })
        .catch((error) => {
          toast(`Unable to remove ${item.name} from cart.`);
          window.ajaxloader.hide();
        });
    };
  }

  applyCoupon() {
    const headers = this.getHeadersForCartRequest();
    return async (code) => {
      window.ajaxloader.show();
      CartModal.applyCoupon(code, headers)
        .then((res) => {
          console.log({ res });
          if (res.error) throw new Error(res.error);
          CartModal.set(res);
          updateCartCount(res.items_count);
          toast(`coupon "${code}" has applied.`);
          //TODO refactor and improve
          this.init();
          window.ajaxloader.hide();
        })
        .catch((error) => {
          toast(error.message, 4000);
          window.ajaxloader.hide();
        });
    };
  }

  removeCoupon(code) {
    const headers = this.getHeadersForCartRequest();
    window.ajaxloader.show();
    CartModal.removeCoupon(code, headers)
      .then((res) => {
        console.log({ res });
        if (res.error) throw new Error(res.error);
        CartModal.set(res);
        updateCartCount(res.items_count);
        toast(`coupon "${code}" removed from cart.`);
        //TODO refactor and improve
        this.init();
        window.ajaxloader.hide();
      })
      .catch((error) => {
        toast(error.message, 4000);
        window.ajaxloader.hide();
      });
  }

  async checkout(cart) {
    const checkout = new CheckoutController();
    const result = await checkout.init();
    console.log(result);
    return;
    const headers = this.getHeadersForCartRequest();
    window.ajaxloader.show();

    const data = {
      billing_address: cart.billing_address,
      shipping_address: cart.shipping_address,
      payment_method: "razorpay",
    };
    CartModal.checkout(data, headers)
      .then((res) => {
        console.log({ res });
        if (res.error) throw new Error(res.error);

        window.ajaxloader.hide();
      })
      .catch((error) => {
        toast(error.message, 4000);
        window.ajaxloader.hide();
      });
  }
}
