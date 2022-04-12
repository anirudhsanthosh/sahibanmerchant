import card from "../../view/components/card";
import ProductCard from "../../view/components/productCard";
import roundButton from "../../view/components/roundButton";
import { createElement } from "../../utils/dom";
import { Chip } from "../../view/components/chip";

export default class OfferCard {
  #card = null;
  #cardContainer = null;
  #cardTitle = null;
  #config = null;
  #body = null;

  constructor(config) {
    this.#config = config;
    this.#cardTitle = config.title;
    this.#cardContainer = document.querySelector(this.#config.cardContainer);

    // create product cards
    const productCards = this.#config.formattedProducts.map((product) => {
      const productCard = ProductCard(product);
      return productCard;
    });

    const categoryChips = this.#config.formatedCategories.map((category) => {
      return Chip(category);
    });

    //create more items buttton

    const button = roundButton({
      icon: "md-arrow-right",
      onclick: this.#config.moreButtonOnclick,
    });

    const buttonWrapper = createElement("div", ["button-wrapper"]);
    buttonWrapper.prepend(button);
    const cardBody = [...productCards, buttonWrapper];

    const cardConfig = {
      title: { content: this.#cardTitle, classNames: ["pb-2"] },
      body: [
        {
          content: categoryChips,
          classNames: ["categories", "slider", "pb-2"],
        },
        { content: cardBody, classNames: ["slider", "products"] },
      ],
    };
    const offerCard = card(cardConfig);
    this.#card = offerCard;
    this.#cardContainer.appendChild(this.#card);
  }
}
