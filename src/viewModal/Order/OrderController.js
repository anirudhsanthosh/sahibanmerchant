import OrderView from "../../view/Order/OrderView.js";
export default class OrderController {
  #view;
  constructor(order = {}) {
    if (Object.keys(order).length === 0)
      throw new Error("Order is empty,must be an object contains id");

    this.order = order; //TODO handle only id situation
    this.init(order);
  }

  init(order) {
    const configForView = this.formatOrderForView(order);
    this.#view = new OrderView(configForView);
  }

  formatOrderForView(order) {
    return {
      id: order.order_id,
      transaction_id: order.order_transaction_id,
      referance: order.order_key,

      message: order.message ?? "",

      itemCount: order.order_item_count,
      items: order.order_items,

      status: order.order_status,

      paymentMetod: order.order_payment_method_title,

      total: order.order_total,
      discount: order.order_discount,
      shipping: order.order_shipping,
      subTotal: order.order_subtotal,
      refunded: order.order_refunded,
    };
  }
}

// message: "Thank you for shopping with us. Your order has been placed."
// order_cancel_endpoint: "http://192.168.166.121/wordpress/cart/"
// order_cancel_url: "http://192.168.166.121/wordpress/cart/?cancel_order=true&amp;order=wc_order_8Pl1qcKgn0XsR&amp;order_id=2731&amp;redirect&amp;_wpnonce=43429cb279"
// order_cancel_url_raw: "http://192.168.166.121/wordpress/cart/?cancel_order=true&order=wc_order_8Pl1qcKgn0XsR&order_id=2731&redirect&_wpnonce=43429cb279"
// order_date_completed: null
// order_date_created: {date: '2022-04-23 11:50:03.000000', timezone_type: 1, timezone: '+00:00'}
// order_date_modified: {date: '2022-04-23 11:50:03.000000', timezone_type: 1, timezone: '+00:00'}
// order_date_paid: null
// order_id: 2731
// order_item_count: 37
// order_items: Array(6)
// 0:
// item_id: 180
// item_image: (4) ['http://192.168.166.121/wordpress/wp-content/uploads/2022/03/mh02-black_main.jpg', 1274, 1580, false]
// item_metadata: []
// item_name: "sugar"
// item_quantity: 1
// item_subtotal: "43"
// item_total: "43"
// [[Prototype]]: Object
// 1: {item_id: 181, item_name: 'best shirtt', item_quantity: 11, item_subtotal: '13200', item_total: '13200', …}
// 2: {item_id: 182, item_name: 'super cool nikkker :-}', item_quantity: 1, item_subtotal: '750', item_total: '750', …}
// 3: {item_id: 183, item_name: 'Circe Hooded Ice Fleece - L, Green', item_quantity: 1, item_subtotal: '68', item_total: '68', …}
// 4: {item_id: 184, item_name: 'Soflyy Mug', item_quantity: 11, item_subtotal: '990', item_total: '990', …}
// 5: {item_id: 185, item_name: 'Soflyy Mug', item_quantity: 12, item_subtotal: '960', item_total: '960', …}
// length: 6
// [[Prototype]]: Array(0)
// order_key: "wc_order_8Pl1qcKgn0XsR"
// order_payment_method: ""
// order_payment_method_title: ""
// order_status: "pending"
// order_total: "16011.00"
// order_transaction_id: ""
// order_url: "http://192.168.166.121/wordpress/checkout/order-received/2731/?key=wc_order_8Pl1qcKgn0XsR"
// parent: 0
