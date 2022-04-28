import { createElement } from "../../utils/dom";
import ProductController from "../../viewModal/Product/ProductController";
import onsPageGenerator from "../components/onsPageGenerator";

export default class OrderView {
  #page;
  constructor(props) {
    this.props = props;
    this.init(props);
  }

  init(props) {
    this.generateAndPushPage(props);
  }

  generateAndPushPage(props) {
    return new Promise((resolve, reject) => {
      const { page: template, id } = onsPageGenerator({
        classNames: ["order-page"],
      });

      template.content.querySelector("ons-page").append();

      document.body.append(template);

      // push new page
      this.#page = window.activeNavigator
        .push(id)
        .then((currentPage) => {
          template.remove(); // remove template element
          // now we have access to the atual page displayed in the navigator
          // save actual referance of page and progress bar and other important elements
          this.#page = currentPage;
          this.#page.querySelector(".page__content").append(this.renderOrder());

          // now that the page is pushed we can manipulate actual page

          return currentPage;
        })
        .catch((error) => {
          console.error(error);
          //TODO catch pge loading error
        });
    });
  }

  renderOrder() {
    const props = this.props;
    const container = createElement("div", ["order-page-container"]);

    // order id
    const orderId = createElement("h2", ["order-page-title"]);
    orderId.append(`Order : #${props.id}`);

    const status = createElement("h3", ["order-page-status"]);
    const statusLabel = createElement("label", ["order-status"]);
    statusLabel.append(`Status`);
    const statusValue = createElement("strong", ["order-status"]);
    statusValue.append(props.status);
    status.append(statusLabel, statusValue);

    let products = [];

    products = props?.items?.map((item) => {
      return this.createItemCard(item);
    });
    products = [this.createItemCard(), ...products];

    // productsContainer
    const productsContainer = createElement("div", [
      "order-page-products-container",
    ]);
    if (products.length !== 0) productsContainer.append(...products);

    const totals = this.generatetotals();

    container.append(orderId, status, productsContainer, totals);
    return container;
  }

  createItemCard(item) {
    const itemCard = createElement("div", ["order-page-product"]);

    if (item?.item_image?.[0]) {
      const image = createElement("img", [], { loading: "lazy" });
      const src = item?.item_image?.[0];
      if (src) {
        window.fileCacheAdaptor
          .get(src)
          .then((url) => (image.src = url))
          .catch(() => (image.src = src));
      }
      itemCard.append(image);
    } else {
      const image = createElement();
      image.append("Image");
      itemCard.append(image);
    }

    const name = createElement();
    item?.item_name ? name.append(item?.item_name) : name.append("Item");

    const quantity = createElement();
    item?.item_quantity
      ? quantity.append(item?.item_quantity)
      : quantity.append("Qty");

    itemCard.append(name, quantity);

    console.log(item);
    if (item?.item_id) {
      itemCard.onclick = () => {
        new ProductController({ product: { id: item?.item_id } });
      };
    }
    return itemCard;
  }

  generatetotals() {
    const props = this.props;
    const container = createElement("div", ["order-page-totals-container"]);

    const label = createElement("h2", ["total-title"]);
    label.append("Price details");
    const total = this.createRow({
      left: { text: "Total" },
      right: { text: props.total, classNames: ["rupee"] },
    });
    const items = this.createRow({
      left: { text: "Items" },
      right: { text: props.subTotal, classNames: ["rupee"] },
    });
    const discount = this.createRow({
      left: { text: "Discount" },
      right: { text: `${props.discount}`, classNames: ["rupee", "negative"] },
    });
    const shipping = this.createRow({
      left: { text: "Delivery" },
      right: { text: `${props.shipping}`, classNames: ["rupee"] },
    });
    const refunded = this.createRow({
      left: { text: "Refunded" },
      right: { text: `${props.refunded}`, classNames: ["rupee", "negative"] },
    });

    container.append(label, items, shipping, discount, refunded, total);
    return container;
  }

  createRow({
    left = { classNames: [], text: "" },
    right = { classNames: [], text: "" },
  }) {
    const row = createElement("div", ["row"]);
    left.text = left?.text ?? "";
    right.text = right?.text ?? "";
    left.classNames = left?.classNames ?? [];
    right.classNames = right?.classNames ?? [];
    const leftColumn = createElement("div", ["column", ...left?.classNames]);
    leftColumn.append(left.text);
    const rightColumn = createElement("div", ["column", ...right?.classNames]);
    rightColumn.append(right.text);
    row.append(leftColumn, rightColumn);
    return row;
  }
}
