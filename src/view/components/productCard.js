import { createElement, createTextNode } from "../../utils/dom";

/**
 *
 * @param {title,onSale,regularPrice,selePrice,image,discountInPercentage,onclick} config
 * product details
 * {
 * }
 */

export default function productCard(config = {}) {
  const {
    title,
    onSale,
    regularPrice,
    selePrice,
    image,
    discountInPercentage,
    onclick,
  } = config;

  //card
  const card = createElement("div", ["product-card"]);

  //card image
  const productImage = createElement("img", ["product-image"], {
    loading: "lazy",
  });
  productImage.src = image;

  //card title
  const cardTitle = createElement("h5", ["product-card-title"]);
  cardTitle.appendChild(createTextNode(title));

  //card body
  const cardBody = createElement("div", ["product-card-body"]);

  // card body content

  // sale price
  const cardPrice = createElement("div", ["product-card-price"]);

  // regular price
  if (regularPrice !== selePrice) {
    const cardPriceRegular = createPrice(regularPrice, [
      "product-card-price-regular",
    ]);

    cardPrice.appendChild(cardPriceRegular);
  }

  const cardPriceSale = createPrice(selePrice, ["product-card-price-sale"]);
  cardPrice.appendChild(cardPriceSale);

  // appending card body content
  cardBody.append(cardTitle, cardPrice);

  // discount
  if (onSale) {
    const cardDiscount = createElement("div", ["product-card-discount"]);
    cardDiscount.appendChild(createTextNode(discountInPercentage));
    cardBody.append(cardDiscount);
  }
  card.append(productImage, cardBody);
  card.onclick = onclick;
  return card;
}

function createPrice(price, classList) {
  const elem = createElement("span", classList);
  elem.appendChild(createTextNode(price));
  return elem;
}
