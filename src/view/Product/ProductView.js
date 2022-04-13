import onsPageGenerator from "../components/onsPageGenerator";
import {
  createElement,
  createTextNode,
  createOnsElement,
} from "../../utils/dom";
import { Chip } from "../../view/components/chip";
import Splide from "@splidejs/splide";

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
    images.forEach((image) => {
      const imageElement = createElement("li", ["splide__slide"]);
      imageElement.appendChild(
        createElement("img", [], { src: image, loading: "lazy" })
      );
      sliderList.appendChild(imageElement);
    });
    sliderTrack.appendChild(sliderList);
    sliderContainer.appendChild(sliderTrack);
    return sliderContainer;
  }

  displayProduct(config) {
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
      console.log(config.categories);

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
