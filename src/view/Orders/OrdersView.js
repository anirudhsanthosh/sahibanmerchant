import { createElement } from "../../utils/dom";
import onsPageGenerator from "../components/onsPageGenerator";
import orderCard from "../components/orderCards";

export default class OrdersView {
  #page;
  constructor(props) {
    this.init(props);
  }

  init(props) {
    this.generateAndPushPage(props.orders, props.loadMore);
  }

  generateAndPushPage(orders, loadMore) {
    return new Promise((resolve, reject) => {
      // creatinhg new ons page
      const { page: template, id } = onsPageGenerator({
        classNames: ["orders-page"],
        title: "Orders",
      });

      // appending template
      document.body.append(template);

      // push new page
      this.#page = window.activeNavigator
        .push(id)
        .then((currentPage) => {
          template.remove(); // remove template element
          // now we have access to the atual page displayed in the navigator
          // save actual referance of page and progress bar and other important elements
          this.#page = currentPage;

          //   creating order cards
          const orderCards = this.generateOrderCards(orders);
          // appending order cards
          const container = createElement("div", ["orders-container"]);
          container.append(...orderCards);
          this.#page.querySelector(".page__content").append(container);

          // load more button
          if (orders && orders.length > 0) {
            const loadMoreButton = createElement("ons-button", [
              "load-more-button",
            ]);
            loadMoreButton.innerHTML = "Load More";
            loadMoreButton.addEventListener("click", loadMore);

            this.#page.querySelector(".page__content").append(loadMoreButton);
          }
          // now that the page is pushed we can manipulate actual page
          // this.setUpPageMeta(currentPage);
          return currentPage;
        })
        .catch((error) => {
          console.error({ error });
          //TODO catch pge loading error
        });
    });
  } //generte and push page

  generateOrderCards(orders) {
    if (!orders) return [];
    const cards = orders.map((order) => {
      return orderCard(order);
    });
    return cards;
  }
  loadMore(props) {
    const orderCards = this.generateOrderCards(props.orders);
    if (!props.loadMore) this.#page.querySelector(".load-more-button").remove();
    this.#page.querySelector(".orders-container").append(...orderCards);
  }
}
