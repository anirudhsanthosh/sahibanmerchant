import OrdersView from "../../view/Orders/OrdersView";
import OrdersModal from "../../modal/Orders/OrdersModal";
import OrderController from "../Order/OrderController";
import userModal from "../../modal/user/userModal";
import { toast } from "../../utils/notification";

export default class OrdersController {
  #view;
  #currentPage = 1;

  constructor() {
    const orders = OrdersModal.get();
    this.init(orders);
  }

  init(orders) {
    const configForView = {
      orders: this.formatOrderForView(orders),
      loadMore: this.loadMore(),
    };
    this.#view = new OrdersView(configForView);
  }

  formatOrderForView(orders) {
    const formatedOrders = orders.map((order) => {
      return {
        id: order.order_id,
        transaction_id: order.order_transaction_id,
        referance: order.order_key,
        message: order.message,
        itemCount: order.order_item_count,
        items: order.order_items,
        status: order.order_status,
        paymentMetod: order.order_payment_method_title,
        total: order.order_total,
        discount: order.order_discount,
        shipping: order.order_shipping,
        subTotal: order.order_subtotal,
        refunded: order.order_refunded,
        onClick: this.orderCardOnclick(order),
      };
    });
    return formatedOrders;
  }

  orderCardOnclick(order) {
    return () => {
      new OrderController(order);
    };
  }

  loadMore() {
    return () => {
      window.ajaxloader.show();
      this.#currentPage++;
      const auth = userModal.getAuthHeader();
      OrdersModal.getOrders({ auth, query: { page: this.#currentPage } })
        .then((orders) => {
          if (orders.error) throw new Error(orders.error);
          // const orders = OrdersModal.get();
          const configForView = {
            orders: this.formatOrderForView(orders.orders),
            loadMore: this.#currentPage < orders.max_num_pages,
          };

          this.#view.loadMore(configForView);
          window.ajaxloader.hide();
        })
        .catch((error) => {
          console.error({ error });
          toast(error);
          window.ajaxloader.hide();
        });
    };
  }
}
