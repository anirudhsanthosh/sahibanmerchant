import { CART_PAGE_DISPLAY_ROOT_ID } from "../../config";
import { cartItemCard, noticeCard } from "../components/card";
import { createElement, createTextNode } from "../../utils/dom";
import { toast } from "../../utils/notification";
import { formatNumber } from "../../utils/sanitize";
import progressbar from "../components/progressbar";
export default class CartView {
  #config;
  #displayRoot;
  #progressBar;
  constructor(config) {
    this.#config = config;

    this.#displayRoot = document.getElementById(CART_PAGE_DISPLAY_ROOT_ID);
    this.init();
  }
  /**
   * this function will return if the view is on stack or not
   */
  isOnStack() {
    return document.getElementById(CART_PAGE_DISPLAY_ROOT_ID);
  }
  // initiate view
  init() {
    if (!this.isOnStack()) return false;

    this.#displayRoot.innerHTML = "";
    this.attachProgressBar(); // attach a new progress bar

    if (!this.#config || Object.keys(this.#config).length === 0) return; //if empty config return

    if (this.#config?.items?.length < 1) {
      return this.cartEmptyStatusIndicator(true);
    }
    this.cartEmptyStatusIndicator();

    this.displayErrors(this.#config.errors);

    this.displayAppliedCoupons(this.#config.appliedCoupons);

    this.displayItemCards(this.#config.items);
    this.displayTotals();

    this.displayApplyCouponForm(this.#config.applyCoupon);

    this.displayTotalPriceAndCheckoutButton();
  }

  attachProgressBar() {
    this.#progressBar = progressbar();
    this.#displayRoot.prepend(this.#progressBar);
  }

  showProgressBar() {
    if (!this.isOnStack()) return;
    this.#progressBar.show();
  }
  hideProgressBar() {
    if (!this.isOnStack()) return;
    this.#progressBar.hide();
  }

  displayErrors(errors = []) {
    if (errors.length === 0) return;
    const errorWrapper = createElement("div", ["cart-notifications"]);
    errors.map((error) => {
      const config = {
        message: error,
        classNames: ["danger"],
      };
      const notice = noticeCard(config);
      errorWrapper.append(notice);
    });

    this.#displayRoot.append(errorWrapper);
  }

  displayItemCards(items) {
    const itemCards = items.map((item) => {
      return cartItemCard(item);
    });

    const itemDisplay = createElement("div", ["cart-items"]);
    itemDisplay.append(...itemCards);
    this.#displayRoot.append(itemDisplay);
  }

  cartEmptyStatusIndicator(empty = false) {
    if (empty) return this.#displayRoot.classList.add("empty");

    return this.#displayRoot.classList.remove("empty");
  }

  displayApplyCouponForm(applyCouponFunction) {
    const couponContainer = createElement("section", ["coupon-form-container"]);
    //label
    const couponLabel = createElement("label", ["coupon-form-label"]);
    couponLabel.textContent = "Apply Coupon";

    //input
    const couponInput = createElement("input", ["coupon-form-input"]);

    //button
    const couponButton = createElement("ons-button", [
      "coupon-form-submit-button",
    ]);
    couponButton.onclick = () => {
      const code = couponInput.value;
      if (!code || code.length < 1) return toast("Invalid coupon code!");
      applyCouponFunction(code);
    };

    const form = createElement("div", ["coupon-form"]);
    form.append(couponInput, couponButton);

    couponButton.textContent = "Apply";
    couponContainer.append(couponLabel, form);
    const wrapper = createElement("div", ["coupon-form-wrapper"]);
    wrapper.append(couponContainer);
    this.#displayRoot.append(wrapper);
  }

  displayAppliedCoupons(coupons) {
    if (coupons.length < 1) return;

    const couponsContainer = createElement("section", [
      "applied-coupons-container",
    ]);
    //label
    const label = createElement("label", ["-label"]);
    const strong = createElement("strong");
    strong.textContent = "Applied Coupons";
    label.append(strong);

    // /coupons

    const couponsCards = coupons.map((coupon) => {
      const couponCard = createElement("div", ["coupon-card"]);
      //code
      const code = createElement("strong");
      code.append(createTextNode(`"${coupon.code}"`));
      const body = createElement("div");
      body.append(code, ` has applied.`);

      // const removeButtonContainer = createElement('')
      const removeButton = createElement("ons-icon", [], { icon: "md-close" });
      removeButton.onclick = () => coupon.remove();
      couponCard.append(body, removeButton);

      return couponCard;
    });

    couponsContainer.append(...couponsCards);
    const wrapper = createElement("div", ["applied-coupons-wrapper"]);
    wrapper.append(label, couponsContainer);
    this.#displayRoot.append(wrapper);
    return;
  }

  displayTotalPriceAndCheckoutButton() {
    const container = createElement("div", ["cart-cta-container"]);
    // toal price
    const totalPrice = createElement("div", ["cart-cta-totalPrice"]);
    const strong = createElement("strong");
    const currencySymbol = createElement("span");
    currencySymbol.textContent = `${this.#config.currency_prefix}`;
    strong.append(currencySymbol, ` ${formatNumber(this.#config.totalPrice)}`);
    totalPrice.append(strong);

    //button
    const button = createElement("div", ["cart-cta-button"]);
    const onsButton = createElement("ons-button");
    onsButton.textContent = "Place Order";
    button.append(onsButton);
    onsButton.onclick = () => this.#config.checkout();

    container.append(totalPrice, button);
    const wrapper = createElement("div", ["cart-cta-wrapper"]);
    wrapper.append(container);
    this.#displayRoot.append(wrapper);
    return;
  }

  displayTotals() {
    const container = createElement("div", ["cart-totals-container"]);

    //label
    const label = createElement("label", ["cart-totals-label"]);
    const strong = createElement("strong");
    strong.textContent = "Price Details";
    label.append(strong);

    //pricces

    ///item total
    const itemTotal = createElement("div", ["cart-totals-line"]);
    const itemTotalValue = createElement("strong");
    itemTotalValue.append(
      this.getCurrencyPrefix(),
      formatNumber(this.#config.totalItems)
    );
    itemTotal.append(
      `Price (${this.#config.itemsCount} item(s))`,
      itemTotalValue
    );

    //shipping
    const shipping = createElement("div", ["cart-totals-line"]);
    const shippingValue = createElement("strong");
    shippingValue.append(
      this.getCurrencyPrefix(),
      formatNumber(this.#config.totalShipping)
    );
    shipping.append(`Delivery`, shippingValue);

    //discount
    const discount = createElement("div", ["cart-totals-line"]);
    const discountValue = createElement("strong");
    discountValue.append(
      `- `,
      this.getCurrencyPrefix(),
      formatNumber(this.#config.totalDiscount)
    );
    discount.append(`Discount`, discountValue);

    // toal price
    const totalPrice = createElement("div", [
      "cart-totals-totalPrice",
      "cart-totals-line",
    ]);
    const totalPriceValue = createElement("strong");
    totalPriceValue.append(
      this.getCurrencyPrefix(),
      formatNumber(this.#config.totalPrice)
    );
    totalPrice.append(`Total`, totalPriceValue);

    container.append(itemTotal, shipping, discount, totalPrice);
    const wrapper = createElement("div", ["cart-totals-wrapper"]);
    wrapper.append(label, container);
    this.#displayRoot.append(wrapper);
  }

  getCurrencyPrefix() {
    const currencySymbol = createElement("span");
    currencySymbol.textContent = `${this.#config.currency_prefix}`;
    return currencySymbol;
  }
}
