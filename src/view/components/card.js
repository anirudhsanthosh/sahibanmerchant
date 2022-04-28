import {
  createElement,
  createTextNode,
  createOnsElement,
} from "../../utils/dom";

//generic card creator , card outer eleent is section
/**
 *
 * @param {*} config
 * takes title,body,
 */
export default function (config = {}) {
  const { title, body } = config;

  const card = createElement("section");
  const cardInnerWrapper = createElement("div", ["section-container"]);
  card.appendChild(cardInnerWrapper);

  const titleClasses = title.classNames ?? [];
  const cardTitle = createElement("h5", ["card-title", ...titleClasses]);

  cardTitle.appendChild(createTextNode(title.content));

  let cardBody;
  if (Array.isArray(body)) {
    cardBody = body.map((body) => {
      return createCardBody(body);
    });
    cardInnerWrapper.append(cardTitle, ...cardBody);
  } else {
    cardBody = createCardBody(body);
    cardInnerWrapper.append(cardTitle, cardBody);
  }

  return card;
}

function createCardBody(body = {}) {
  const bodyClasses = body.classNames ?? [];
  const cardBody = createElement("div", ["card-body", ...bodyClasses]);
  const [leftShadow, rightShadow] = createShadowElements();
  cardBody.append(leftShadow, ...body.content, rightShadow);

  // attaching scroll event with card body
  // attachScrollEventForShadows({ cardBody, leftShadow, rightShadow });

  // change opacity of shadow elements at the time of mounting
  // validateScrllShadows({ cardBody, leftShadow, rightShadow });
  return cardBody;
}

function createShadowElements() {
  const leftShadow = createElement("div", [
    "scroll-shadow-left",
    "scroll-shadow",
  ]);
  const rightShadow = createElement("div", [
    "scroll-shadow-right",
    "scroll-shadow",
  ]);
  return [leftShadow, rightShadow];
}

// this event will monitor how far the emenet is scrolled horizontaly
function attachScrollEventForShadows({ cardBody, leftShadow, rightShadow }) {
  cardBody.addEventListener("scroll", (e) => {
    const cardBodyWidth = cardBody.getBoundingClientRect().width;
    // const cardBodyOffsetLeft = cardBody.offsetLeft;
    const cardScrollWidth = cardBody.scrollWidth;

    const scrolled = e.target.scrollLeft / (cardScrollWidth - cardBodyWidth);
    leftShadow.style.opacity = scrolled;
    rightShadow.style.opacity = 1 - scrolled;
  });
}

function validateScrllShadows({ cardBody, leftShadow, rightShadow }) {
  // create a mutation observer and watch the element is atached to dom or not
  let observer;
  const mutationCallback = (mutations) => {
    mutations.forEach(function (mutation) {
      for (var i = 0; i < mutation.addedNodes.length; i++) {
        if (document.body.contains(cardBody)) {
          observer.disconnect();
          const cardBodyWidth = cardBody.getBoundingClientRect().width;
          const cardScrollWidth = cardBody.scrollWidth;
          if (cardBodyWidth / cardScrollWidth < 1) {
            leftShadow.style.opacity = 0;
            rightShadow.style.opacity = 1;
          }
        }
      }
    });
  };
  observer = new MutationObserver(mutationCallback);
  observer.observe(document, {
    childList: true,
    subtree: true,
  });
}
// notice card
export function noticeCard(config = { classNames: ["danger"] }) {
  const { message, classNames } = config;
  if (!message) return null;
  const noticeWrapper = createElement("div", ["notice", ...classNames]);
  noticeWrapper.append(createTextNode(message));
  return noticeWrapper;
}

//cart item card
export function cartItemCard(config = {}) {
  const card = createElement("div", ["cart-item-card"]);
  //title
  const name = createElement("div", ["cart-item-card-item-name"]);
  name.append(createTextNode(config.name));

  //body
  const bodyWrapper = createElement("div", [
    "cart-item-card-item-body-wrapper",
  ]);

  //card notice
  const cardNotice = createElement("div", ["cart-item-notice"]);

  const message = (message) => {
    cardNotice.innerHTML = "";
    cardNotice.appendChild(createTextNode(message));
  };
  // card loader
  const cardLoader = createElement("div", ["cart-item-loader"]);
  const spinner = createOnsElement(
    '<ons-icon icon="md-spinner" spin></ons-icon>'
  );
  cardLoader.append(spinner);

  cardLoader.show = () => cardLoader.classList.add("show");
  cardLoader.hide = () => cardLoader.classList.remove("show");
  //right
  const bodyRight = createElement("div", ["cart-item-card-item-body-right"]);
  // image in the card
  const image = createElement("img", ["cart-item-card-image"]);
  image.src = config.image;

  //quantity input box
  const quantityContainer = createElement("div", ["quantity-wrapper"]);
  const quantityLabel = createElement("label", ["quantity-label"]);
  quantityLabel.append(createTextNode("Quantity"));
  const quantity = createElement("input", ["cart-item-card-quantity"], {
    type: "number",
    value: config.quantity,
  });

  quantity.onchange = () => {
    cardLoader.show();
    config
      .updateQuantity(quantity.value)
      .then((res) => {
        quantity.classList.remove("error");
        cardLoader.hide();
      })
      .catch((error) => {
        console.log({ errFromview: error });
        quantity.classList.add("error");
        quantity.value = config.quantity;
        message(error.message);
        cardLoader.hide();
      });
  };

  quantityContainer.append(quantityLabel, quantity);

  bodyRight.append(image, quantityContainer);

  //left
  const bodyLeft = createElement("div", ["cart-item-card-item-body-left"]);
  const priceWrapper = createElement("div", [
    "cart-item-card-item-price-wrapper",
  ]);
  const regularPrice = createElement("div", [
    "cart-item-card-item-regular-price",
  ]);
  const salePrice = createElement("div", ["cart-item-card-item-sale-price"]);
  const offer = createElement("div", ["cart-item-card-item-offer"]);

  salePrice.append(createTextNode(config.salePrice));
  if (config.discount) offer.append(createTextNode(config.discount));
  if (config.regularPrice)
    regularPrice.append(createTextNode(config.regularPrice));
  priceWrapper.append(regularPrice, salePrice, offer);
  bodyLeft.append(priceWrapper);

  bodyWrapper.append(bodyLeft, bodyRight);

  const buttonWrapper = createElement("div", ["cart-item-card-button-wrapper"]);
  const removeButton = createElement(
    "ons-button",
    ["cart-item-card-remove-button"],
    { modifier: "large", icon: "md-delete" } //"large--quiet"
  );
  removeButton.append(createTextNode("Remove"));
  removeButton.onclick = () => {
    config.removeButtonOnclick();
  };
  // const addButton = createElement("button", ["cart-item-card-add-button"]);
  // addButton.append(createTextNode("Add"));
  buttonWrapper.append(removeButton);

  card.append(name, bodyWrapper, cardNotice, buttonWrapper, cardLoader);

  return card;
}
