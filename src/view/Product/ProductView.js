import onsPageGenerator from "../components/onsPageGenerator";
import {
  createElement,
  createTextNode,
  createOnsElement,
} from "../../utils/dom";
import { Chip } from "../../view/components/chip";
import Splide from "@splidejs/splide";
import { toast } from "../../utils/notification";

export default class ProductView {
  #config;
  #page;
  #progressBar;

  constructor(config = {}) {
    if (config.constructor.name !== "Object") {
      throw new Error("config must be an object");
    }
    this.#config = config;
    this.init();
  }
  init() {
    //createTemplatePage
    const { page, id } = this.createTemplatePage();
    // the page is atttached with body
    // push new page
    this.#page = window.activeNavigator
      .push(id)
      .then((currentPage) => {
        page.remove(); // remove template element
        // now we have access to the atual page displayed in the navigator
        // save actual referance of page and progress bar and other important elements
        this.#page = currentPage;
        this.#progressBar = this.#page.querySelector(".progress-bar");

        // now that the page is pushed we can manipulate actual page
        this.setUpPageMeta(currentPage);
        return currentPage;
      })
      .catch((error) => {
        //TODO catch pge loading error
      });
  }

  /**
   * this function will be called after the page is attached to navigator
   */
  setUpPageMeta() {
    // set title of page
    // const title = this.#config?.product?.name ?? "";
    // this.setTitle(title);
  }

  /**
   *
   * @returns <template>element  and its id with ons page attached to it
   */

  createTemplatePage() {
    // configration for new page
    const pageConfig = {
      classNames: ["product-display-page-from-template"],
    };
    /// create a new ons page
    const { page, id } = onsPageGenerator(pageConfig);

    //progress bar
    const progressBarContainer = this.createProductPageHeader();

    // create container for images

    const imagesContainer = createElement("div", ["images-container"]);

    // create container for product info
    const productInfoContainer = createElement("div", [
      "product-info-container",
    ]);

    //append imageContainer and productinfo container and progress bar  with page
    page.content
      .querySelector("ons-page")
      .append(progressBarContainer, imagesContainer, productInfoContainer);

    // apppend page with body
    document.body.appendChild(page);

    return { page, id };
  }

  //set page title at toolbar
  setTitle(title) {
    if (!title) return;
    Promise.resolve(this.#page).then((page) => {
      this.#page.querySelector("ons-toolbar .center").innerHTML = "";
      this.#page
        .querySelector("ons-toolbar .center")
        .appendChild(createTextNode(title));
    });
  }

  createImageSlider(images = [], id) {
    const sliderContainer = createElement(
      "section",
      [`product-image-slider-container`, "splide"],
      { id: `product-image-slider-container-${id}` }
    );
    const sliderTrack = createElement("div", ["splide__track"]);
    const sliderList = createElement("ul", ["splide__list"]);
    images.forEach((imageSrc) => {
      const imageElement = createElement("li", ["splide__slide"]);

      const image = createElement("img", [], { loading: "lazy" });
      if (imageSrc) {
        window.fileCacheAdaptor
          .get(imageSrc)
          .then((url) => (image.src = url))
          .catch(() => (image.src = imageSrc));
      }
      imageElement.appendChild(image);
      sliderList.appendChild(imageElement);
    });
    sliderTrack.appendChild(sliderList);
    sliderContainer.appendChild(sliderTrack);
    return sliderContainer;
  }

  displayProduct(config) {
    return Promise.resolve(this.#page).then((page) => {
      if (config.type === "simple") {
        return this.displaySimpleProduct(config);
      }

      return this.displayVariableProduct(config);
    });
  }

  displaySimpleProduct(config) {
    const images = config.images;
    this.createAndAttachImageContainer(images);

    // check featured product or not
    const featuredProduct = config.featuredProduct;
    if (featuredProduct) {
      this.createAndDisplayFeaturedImageTag();
    }
    // clear content of info container
    this.getProductInfoContainer().innerHTML = "";

    // attach heading
    this.createAndAttachProductTitle(config.name);

    //display price
    this.createAndAttachSimpleProductPrice({
      regularPrice: config.regulaPrice,
      sellingPrice: config.sellingPrice,
      offer: config.offer,
      onSale: config.onSale,
    });

    //display short description
    this.createAndAttachShortDescription(config.shortDescription);

    //specification attributes
    this.createAndAttachSpecificationAttributs(config.specificationAttributes);

    //description
    this.createAndAtachDescription(config.description);

    //categories
    this.createAndAttachCategories(config.categories);

    // add to cart buttton
    this.createAndAttachAddToCartButton({
      cartButtonOnclick: config.cartButtonOnclick,
      isPurchasable: config.isPurchasable,
    });
  }

  displayVariableProduct(config) {
    const images = config.images;
    this.createAndAttachImageContainer(images);

    // check featured product or not
    const featuredProduct = config.featuredProduct;
    if (featuredProduct) {
      this.createAndDisplayFeaturedImageTag();
    }

    // clear content of info container
    this.getProductInfoContainer().innerHTML = "";

    //attach heading
    this.createAndAttachProductTitle(config.name);

    //prices
    // if the prooduct is not on sale we can display the price as simple product without offer
    if (!config.onSale)
      this.createAndAttachSimpleProductPrice({
        sellingPrice: config.sellingPrice,
      });
    // now display price in from - to format
    else {
      this.createAndAttachVariableProductPrice({
        regularPrice: config.priceTo,
        sellingPrice: config.priceFrom,
        offer: config.variationDiscount,
      });
    }
    // attach variations
    this.createAndAttachVariations(config.variations);

    //display short description
    this.createAndAttachShortDescription(config.shortDescription);

    //specification attributes
    this.createAndAttachSpecificationAttributs(config.specificationAttributes);

    //description
    this.createAndAtachDescription(config.description);

    //categories
    this.createAndAttachCategories(config.categories);

    // add to cart buttton
    this.createAndAttachAddToCartButton({
      cartButtonOnclick: config.cartButtonOnclick,
      isPurchasable: config.isPurchasable,
    });
  }

  createAndAttachImageContainer(images) {
    const sliderId = Math.floor(Math.random() * 100000);
    const imageSlider = this.createImageSlider(images, sliderId);
    // slider ------------------------------------------------------------------
    const productImageContainer = this.#page.querySelector(".images-container");
    productImageContainer.innerHTML = "";
    productImageContainer.appendChild(imageSlider);
    new Splide(`#product-image-slider-container-${sliderId}`, {
      type: "loop",
      // perPage: 3,
      arrows: false,
      lazyLoad: true,
    }).mount();
  }

  createAndDisplayFeaturedImageTag() {
    // featured product------------------------------------------------------------
    const productImageContainer = this.#page.querySelector(".images-container");
    const featuredProductLabel = createElement("span", [
      "featured-product-label",
    ]);
    featuredProductLabel.append(createTextNode("Featured"));
    productImageContainer.append(featuredProductLabel);
  }

  createAndAttachProductTitle(title) {
    // product info-------------------------------------------------------
    const productInfoContainer = this.getProductInfoContainer();

    const productName =
      this.#page.querySelector(".product-name") ??
      createElement("h1", ["product-name"]);
    productName.innerHTML = "";
    productName.appendChild(createTextNode(title));
    if (!this.#page.querySelector(".product-name"))
      productInfoContainer.append(productName);
  }

  createAndAttachSimpleProductPrice({
    regularPrice = "",
    sellingPrice = "",
    offer = "",
    onSale = false,
  }) {
    const priceContainer =
      this.#page.querySelector(".price-container") ??
      createElement("div", ["price-container"]);
    priceContainer.innerHTML = "";

    const productRegularPrice = createElement(
      "h2",
      ["product-price-regular"],
      {}
    );
    const productSellingPrice = createElement(
      "h2",
      ["product-price-selling"],
      {}
    );
    const productOffer = createElement("h2", ["product-price-offer"], {});
    productOffer.appendChild(createTextNode(offer));

    productSellingPrice.appendChild(
      createTextNode(Number(sellingPrice).toLocaleString())
    );
    productRegularPrice.appendChild(
      createTextNode(Number(regularPrice).toLocaleString())
    );

    if (onSale) priceContainer.append(productRegularPrice);
    priceContainer.append(productSellingPrice);
    if (onSale) priceContainer.append(productOffer);

    if (!this.#page.querySelector(".price-container"))
      this.getProductInfoContainer().append(priceContainer);
  }

  createAndAttachVariations(variations) {
    console.log(variations);
    //container
    const variationContainer =
      this.#page.querySelector(".variation-container") ??
      createElement("div", ["variation-container"]);

    //label
    const variationContainerLabel = createElement("h3", [
      "variation-container-label",
    ]);
    variationContainerLabel.appendChild(createTextNode("Variations"));

    // variation body
    const variationBody = createElement("div", [
      "variation-body",
      "flex-slider",
    ]);

    //append childs to body
    variationContainer.append(variationContainerLabel, variationBody);

    const variationCards = variations.map((variaion) => {
      const variationCard = createElement("div", ["variation-card"]);
      const variationImage = createElement("img", ["variation-card-image"], {
        loading: "lazy",
      });
      if (variaion.image) {
        window.fileCacheAdaptor
          .get(variaion.image)
          .then((url) => (variationImage.src = url))
          .catch(() => (variationImage.src = variaion.image));
      }

      const variationPriceContainer = createElement("div", [
        "variation-card-price-container",
      ]);
      //attaching prices
      if (variaion.regularPrice) {
        const regularPrice = createElement("div", [
          "variation-card-regular-price",
        ]);
        regularPrice.append(createTextNode(variaion.regularPrice));
        variationPriceContainer.append(regularPrice);
      }
      if (variaion.salePrice) {
        const salePrice = createElement("div", ["variation-card-sale-price"]);
        salePrice.append(createTextNode(variaion.salePrice));
        variationPriceContainer.append(salePrice);
      }
      if (variaion.discount) {
        const discount = createElement("div", ["variation-card-discount"]);
        discount.append(createTextNode(variaion.discount));
        variationPriceContainer.append(discount);
      }

      // attaching attributes
      // container
      const variationAttributesContainer = createElement("div", [
        "variation-card-attribute-container",
      ]);

      // map through attributes
      variaion.attributes.map((attr) => {
        const attrContainer = createElement("div", [
          "variation-card-attribute",
        ]);
        const text = createTextNode(
          `${attr.attributeName} : ${attr.attributeValue}`
        );
        attrContainer.append(text);
        variationAttributesContainer.append(attrContainer);
      });

      /// attaching everuything to card
      variationCard.append(
        variationImage,
        variationPriceContainer,
        variationAttributesContainer
      );

      variationCard.onclick = () => {
        variaion
          .onclick()
          .then((res) => {
            [...variationBody.childNodes].map((card) => {
              card.classList.remove("active");
            });
            variationCard.classList.add("active");
          })
          .catch((err) => {
            console.trace({ errorInVariationcardSelection: err });
            toast(`Can't select variation`);
          });
      };
      return variationCard;
    });

    variationBody.append(...variationCards);

    //append to document
    if (!this.#page.querySelector(".variation-container"))
      this.getProductInfoContainer().append(variationContainer);
  }
  createAndAttachVariableProductPrice({
    regularPrice = "",
    sellingPrice = "",
    offer = "",
  }) {
    const priceContainer =
      this.#page.querySelector(".price-container") ??
      createElement("div", ["price-container"]);
    priceContainer.innerHTML = "";

    const productRegularPrice = createElement(
      "h2",
      ["product-price-selling"],
      {}
    );
    const productSellingPrice = createElement(
      "h2",
      ["product-price-selling"],
      {}
    );

    productSellingPrice.appendChild(
      createTextNode(Number(sellingPrice).toLocaleString())
    );
    productRegularPrice.appendChild(
      createTextNode(Number(regularPrice).toLocaleString())
    );

    priceContainer.append(productRegularPrice);
    priceContainer.append(createTextNode("-"));
    priceContainer.append(productSellingPrice);
    if (offer) {
      const productOffer = createElement("h2", ["product-price-offer"], {});
      productOffer.appendChild(createTextNode(`Upto ${offer}`));
      priceContainer.append(productOffer);
    }
    this.getProductInfoContainer().append(priceContainer);
  }

  createAndAttachShortDescription(text = "") {
    // ------------------------------------short descripton------------------------------
    if (text === "") return;
    // const detailsContainer = this.#page.querySelector('.details-container') ?? createElement("div", ["details-container"]);
    const shortDescriptionLabel = createElement(
      "h3",
      ["short-description-label"],
      {}
    );

    const shortDescription = createElement("div", ["short-description"]);
    shortDescriptionLabel.appendChild(createTextNode("Key features"));
    shortDescription.innerHTML = text; //this.formatShortDescription(config.shortDescription);
    const shortDescriptionContainer =
      this.#page.querySelector(".short-description-container") ??
      createElement("div", ["short-description-container"]);
    shortDescriptionContainer.innerHTML = "";
    shortDescriptionContainer.append(shortDescriptionLabel, shortDescription);
    // detailsContainer.append(shortDescriptionContainer);
    if (!this.#page.querySelector(".short-description-label"))
      this.getProductInfoContainer().append(shortDescriptionContainer);
  }

  createAndAttachSpecificationAttributs(attributes) {
    if (attributes == "" || attributes.length < 1) return;
    //create label for specification
    const specificationLabel = createElement("h3", ["specification-label"], {});
    specificationLabel.appendChild(createTextNode("Specifications"));

    //create body for specification

    const specifications = createElement("ul", ["specification-body"]);

    ///create container for specifications
    const specificationsContainer =
      this.#page.querySelector(".specification-container") ??
      createElement("div", ["specification-container"]);
    specificationsContainer.innerHTML = "";

    //attach all to container
    specificationsContainer.append(specificationLabel, specifications);

    // populate body with specs
    attributes.map((attribute) => {
      const li = createElement("li", ["product-atttribute"]);
      li.append(createTextNode(`${attribute.name} : ${attribute.value}`));
      specifications.append(li);
    });

    //attach container with document body
    if (!this.#page.querySelector(".specification-container"))
      this.getProductInfoContainer().append(specificationsContainer);

    if (this.#page.querySelector(".variation-container"))
      this.#page
        .querySelector(".variation-container")
        .after(specificationsContainer);
  }
  createAndAtachDescription(text) {
    if (text === "") return;
    const descriptionLabel = createElement("h3", ["description-label"], {});
    const description = createElement("div", ["description"]);
    descriptionLabel.appendChild(createTextNode("Description "));

    description.innerHTML = text; //.appendChild(createTextNode(config.description));
    const descriptionContainer =
      this.#page.querySelector(".description-container") ??
      createElement("div", ["description-container"]);
    descriptionContainer.innerHTML = "";
    descriptionContainer.append(descriptionLabel, description);

    if (!this.#page.querySelector(".description-container"))
      this.getProductInfoContainer().append(descriptionContainer);
  }

  createAndAttachCategories(categories) {
    // ---------------------------categories-------------------------------------
    const categoriesContainer =
      this.#page.querySelector(".product-page-categories-Container") ??
      createElement("div", ["product-page-categories-Container"]);
    categoriesContainer.innerHTML = "";
    if (categories.length < 1) return;
    const categoriesTitle = createElement("h3", [
      "product-page-category-title",
    ]);
    categoriesTitle.appendChild(createTextNode("Categories"));
    const categoriesBody = createElement("div", ["product-page-category-body"]);

    categories.map((category) => {
      categoriesBody.append(Chip(category));
    });
    categoriesContainer.append(categoriesTitle, categoriesBody);
    if (!this.#page.querySelector(".product-page-categories-Container"))
      this.getProductInfoContainer().append(categoriesContainer);
  }

  createAndAttachAddToCartButton({ cartButtonOnclick, isPurchasable }) {
    // ---------------------------add to cart-------------------------------------

    const addToCartContainer =
      this.#page.querySelector(".add-to-cart-container") ??
      createElement("div", ["add-to-cart-container"]);
    addToCartContainer.innerHTML = "";
    const buttonProperties = isPurchasable ? {} : { disabled: true };
    const addToCartButton = createElement(
      "button",
      ["add-to-cart-button"],
      buttonProperties
    );
    addToCartButton.appendChild(createTextNode("Add to cart"));
    if (!isPurchasable) {
      const unavailaleLabel = createElement("span", ["product-unavailable"]);
      unavailaleLabel.append(createTextNode("Product Unavailable"));
      addToCartContainer.appendChild(unavailaleLabel);
    }
    addToCartContainer.appendChild(addToCartButton);
    //cart button on click
    addToCartButton.onclick = cartButtonOnclick;

    if (!this.#page.querySelector(".add-to-cart-container"))
      this.getProductInfoContainer().append(addToCartContainer);
  }

  getProductInfoContainer() {
    return this.#page.querySelector(".product-info-container");
  }

  updateView(config) {
    return new Promise((resolve, reject) => {
      // image
      if (config.images && config.images.length > 0) {
        this.createAndAttachImageContainer(config.images);
      }
      //price
      this.createAndAttachSimpleProductPrice({
        regularPrice: config.regularPrice,
        sellingPrice: config.salePrice,
        offer: config.offer,
        onSale: config.onSale,
      });
      //specificatioon
      this.createAndAttachSpecificationAttributs(
        config.specificationAttributes
      );
      //title
      this.createAndAttachProductTitle(config.title);
      //description
      this.createAndAtachDescription(config.description);
      resolve(true);
    });
  }

  xdisplayProduct(config) {
    console.trace({ config });

    const images = config.images;
    const sliderId = Math.floor(Math.random() * 100000);
    const imageSlider = this.createImageSlider(images, sliderId);

    // slider ------------------------------------------------------------------
    const productImageContainer = this.#page.querySelector(".images-container");
    productImageContainer.innerHTML = "";
    productImageContainer.appendChild(imageSlider);
    new Splide(`#product-image-slider-container-${sliderId}`, {
      type: "loop",
      // perPage: 3,
      arrows: false,
      lazyLoad: true,
    }).mount();

    // featured product------------------------------------------------------------
    const featuredProduct = config.featuredProduct;
    if (featuredProduct) {
      const featuredProductLabel = createElement("span", [
        "featured-product-label",
      ]);
      featuredProductLabel.append(createTextNode("Featured"));
      productImageContainer.append(featuredProductLabel);
    }

    // product info-------------------------------------------------------
    const productInfoContainer = this.#page.querySelector(
      ".product-info-container"
    );

    const productName = createElement("h1", ["product-name"]);
    productName.appendChild(createTextNode(config.name));

    // price-------------------------------------------------------
    const priceContainer = createElement("div", ["price-container"]);

    const productRegularPrice = createElement(
      "h2",
      ["product-price-regular"],
      {}
    );
    const productSellingPrice = createElement(
      "h2",
      ["product-price-selling"],
      {}
    );
    const productOffer = createElement("h2", ["product-price-offer"], {});
    productOffer.appendChild(createTextNode(config.offer));
    productSellingPrice.appendChild(
      createTextNode(Number(config.sellingPrice).toLocaleString())
    );
    productRegularPrice.appendChild(
      createTextNode(Number(config.regulaPrice).toLocaleString())
    );

    if (config.onSale) priceContainer.append(productRegularPrice);
    priceContainer.append(productSellingPrice);
    if (config.onSale) priceContainer.append(productOffer);

    // details-------------------------------------------------------
    const detailsContainer = createElement("div", ["details-container"]);

    // ------------------------------------short descripton------------------------------
    if (config.shortDescription && config.shortDescription != "") {
      const shortDescriptionLabel = createElement(
        "h3",
        ["short-description-label"],
        {}
      );
      const shortDescription = createElement("div", ["short-description"]);
      shortDescriptionLabel.appendChild(createTextNode("Key features"));
      shortDescription.innerHTML = config.shortDescription; //this.formatShortDescription(config.shortDescription);
      const shortDescriptionContainer = createElement("div", [
        "short-description-container",
      ]);
      shortDescriptionContainer.append(shortDescriptionLabel, shortDescription);
      detailsContainer.append(shortDescriptionContainer);
    }
    // -----------------------------description-------------------------------------------------------
    if (config.description && config.description != "") {
      const descriptionLabel = createElement("h3", ["description-label"], {});
      const description = createElement("div", ["description"]);
      descriptionLabel.appendChild(createTextNode("Description "));

      description.innerHTML = config.description; //.appendChild(createTextNode(config.description));
      const descriptionContainer = createElement("div", [
        "description-container",
      ]);
      descriptionContainer.append(descriptionLabel, description);
      detailsContainer.append(descriptionContainer);
    }

    // ---------------------------categories-------------------------------------
    const categoriesContainer = createElement("div", [
      "product-page-categories-Container",
    ]);
    if (config.categories && config.categories.length > 0) {
      const categoriesTitle = createElement("h3", [
        "product-page-category-title",
      ]);
      categoriesTitle.appendChild(createTextNode("Categories"));
      const categoriesBody = createElement("div", [
        "product-page-category-body",
      ]);

      config.categories.map((category) => {
        categoriesBody.append(Chip(category));
      });
      categoriesContainer.append(categoriesTitle, categoriesBody);
    }
    // ---------------------------add to cart-------------------------------------

    const addToCartContainer = createElement("div", ["add-to-cart-container"]);
    const buttonProperties = config.isPurchasable ? {} : { disabled: true };
    const addToCartButton = createElement(
      "button",
      ["add-to-cart-button"],
      buttonProperties
    );
    addToCartButton.appendChild(createTextNode("Add to cart"));
    if (!config.isPurchasable) {
      const unavailaleLabel = createElement("span", ["product-unavailable"]);
      unavailaleLabel.append(createTextNode("Product Unavailable"));
      addToCartContainer.appendChild(unavailaleLabel);
    }
    addToCartContainer.appendChild(addToCartButton);
    //cart button on click
    addToCartButton.onclick = config.cartButtonOnclick;

    // ----------------------------attach everything to page--------------------------------
    productInfoContainer.innerHTML = "";

    productInfoContainer.append(
      productName,
      priceContainer,
      detailsContainer,
      categoriesContainer,
      addToCartContainer
    );
    return true;
  }

  // format description
  formatShortDescription(shortDescription) {
    const shortDescriptionArray = shortDescription.split("\n");
    if (shortDescriptionArray.length < 2) return shortDescription;

    const ui = `<ul class="short-description-list">`;
    const shortDescriptionFormatted = shortDescriptionArray.map((item) => {
      if (item == "" || item == "\n") return "";
      return `<li>${item}</li>`;
    });
    const uiEnd = `</ul>`;
    return ui + shortDescriptionFormatted.join("") + uiEnd;
  }

  // product page header this includes progress bar and other stickey materials
  createProductPageHeader() {
    const productsHeader = createElement("div", ["product-header"]);
    // create progressbar and attach to page
    const progressBar = this.createProgressBar();

    productsHeader.append(progressBar);

    return productsHeader;
  }

  createProgressBar() {
    // <ons-progress-bar value="20" secondary-value="50"></ons-progress-bar>
    const progressBar = createElement("ons-progress-bar", ["progress-bar"], {
      indeterminate: true,
    });
    return progressBar;
  }

  async hideProgressBar() {
    try {
      const page = await this.#page;
      this.#progressBar.style.display = "none";
    } catch (e) {
      return e;
    }
  }

  async showProgressBar() {
    try {
      const page = await this.#page;
      this.#progressBar.style.display = "block";
    } catch (e) {
      return e;
    }
  }
}
