import { createElement, createOnsElement } from "../../utils/dom";
import twoColumnrow from "../components/twoColumnRow";

export default function orderCard(props) {
  // card
  const card = createElement("div", ["orders-order-card"]);
  //title
  const title = createElement("h2", ["orders-order-card-title"]);

  title.append(`Order: #${props.id}`);
  //amount
  const amount = twoColumnrow({
    left: {
      text: "Total",
    },
    right: {
      text: props.total,
      classNames: ["strong", "rupee"],
    },
  });
  // status
  const status = twoColumnrow({
    left: {
      text: "Status",
    },
    right: {
      text: props.status,
      classNames: ["active"],
    },
  });

  const itemCount = twoColumnrow({
    left: {
      text: "Total items",
    },
    right: {
      text: props.itemCount,
    },
  });

  card.append(title, status, itemCount, amount);
  card.onclick = () => {
    props.onClick();
  };
  return card;
}
