import onsPageGenerator from "../components/onsPageGenerator";
import {
  createElement,
  createTextNode,
  createOnsElement,
} from "../../utils/dom";
import ProductCard from "../../view/components/productCard";
import { MAX_NUMBER_OF_PRODUCTS_PER_PAGE } from "../../config";

export default class ProductsView {
  #page;
  #config;
  #progressBar;
  #infinateScrollProgress;
  #suspendInfinateScroll = false;
  constructor(config = {}) {
    if (config.constructor.name !== "Object") {
      throw new Error("config must be an object");
    }

    this.#config = config;
    this.init();
  }

  init() {
    // create template containing ons page
    const { page, id } = onsPageGenerator();

    // create container for products
    const productsContainer = createElement("div", ["products-container"]);

    // create products header
    const productsHeader = this.createProductsPageHeader();

    const infinateScrollProgress = this.createInfinateScrollProgress();

    // apepend pocuct container to page
    page.content
      .querySelector("ons-page")
      .append(productsHeader, productsContainer, infinateScrollProgress);

    // apppend page with body
    document.body.appendChild(page);

    this.#page = window.activeNavigator.push(id).then((currentPage) => {
      page.remove(); // remove template element
      this.#page = currentPage;
      this.#progressBar = this.#page.querySelector(".progress-bar");
      this.#infinateScrollProgress = this.#page.querySelector(
        ".products-infinate-scroll-progress-container"
      );
      this.setTitle(this.#config.title);

      // setting up event listeners
      // sort buton
      const sortButton = this.#page.querySelector(".sort-button");
      sortButton.addEventListener("click", this.sortButtonOnclick());

      //infiate scroll
      // this.addInfiniteScrollEvent();

      return currentPage;
    });
  }

  async addProducts(products = [], clear = false) {
    try {
      const page = await this.#page;
      const container = this.#page.querySelector(".products-container");
      const cards = products.map((product) => ProductCard(product));

      // remove infinate scroll event for not triggering when adding new products
      this.removeInfiniteScrollEvent();

      if (clear) {
        container.innerHTML = "";
      }

      if (products.length === 0 && clear) {
        container.innerHTML = "No products found";
        return container.classList.add("empty-result");
      }

      container.classList.remove("empty-result");
      container.append(...cards);
      if (clear) {
        // container.scrollIntoView(true);
        page.querySelector(".page__content").scrollBy({
          top: -10000,
          behavior: "smooth",
        });
      }

      // for ensure infinenatescrolll not triggered while dding new produts
      // attach the same only after everything comletes
      this.addInfiniteScrollEvent();
      if (clear) {
        //infiate scroll
        // this.addInfiniteScrollEvent();
        this.showInfinateScroll();
      }
      // remove loading more content and infinate scroll event from page if
      // the count of proucts is lessthan max number of products per page

      if (products.length < MAX_NUMBER_OF_PRODUCTS_PER_PAGE) {
        this.hideInfinateScroll();
        this.removeInfiniteScrollEvent();
      }
      return page;
    } catch (e) {
      console.trace(e);
      return e;
    }
  }
  clearAllProducts() {
    const container = this.#page.querySelector(".products-container");
    container.innerHTML = "";
  }

  setTitle(title) {
    if (!title) return;
    Promise.resolve(this.#page).then((page) => {
      this.#page.querySelector("ons-toolbar .center").innerHTML = "";
      this.#page
        .querySelector("ons-toolbar .center")
        .appendChild(createTextNode(title));
    });
  }

  createProductsPageHeader() {
    const productsHeader = createElement("div", ["products-header"]);

    // create buttons for sorting and filtering
    const sortButton = createElement("ons-button", ["sort-button"], {
      modifier: "large--quiet",
    });
    const sortIcon = createElement("ons-icon", ["material-icons", "pr-2"], {
      icon: "md-sort-amount-desc",
    });

    sortButton.append(sortIcon, createTextNode("Sort"));

    // create filter button
    const filterButton = createElement("ons-button", ["filter-button"], {
      modifier: "large--quiet",
    });
    const filterIcon = createElement("ons-icon", ["material-icons", "pr-2"], {
      icon: "md-filter-list",
    });

    filterButton.append(filterIcon, createTextNode("Filter"));

    const buttonWraper = createElement("div", ["button-wrapper"]);

    // append buttons to header
    buttonWraper.append(sortButton, filterButton);

    // create progressbar and attach to page
    const progressBar = this.createProgressBar();

    productsHeader.append(buttonWraper, progressBar);

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

  sortButtonOnclick() {
    // for storing current state of selected option
    let activeSortOption;

    // format options for as label and on click properties
    const config = this.#config.sortMenuItems.map((item, index) => {
      if (item.selected) activeSortOption = index;
      const formatted = {
        label: item.label,
        onclick: item.onclick,
      };
      return formatted;
    });

    //create a function to handle the sort button click this function will be called when the sort button is clicked
    //this will create a popu containing the options for sorting, and will set the option to the selected option and call the onclick event passed to it
    return () => {
      // each time this function called it will create new list for showing active sort option and others
      const formated = config.map((item, index) => {
        return {
          ...item,
          icon:
            activeSortOption === index
              ? "md-check"
              : "md-check-box-outline-blank",
        };
      });

      // displaying actual options
      ons
        .openActionSheet({
          title: "Sort By",
          cancelable: true,
          buttons: [...formated],
        })
        .then(function (index) {
          if (index === -1) return;
          const optionChanged = formated[index].onclick(); // firing function recieved from controller
          if (optionChanged) activeSortOption = index; // setting new active option
        });
    };
  }
  onInfiniteScroll() {
    return (scrollingDoneCallback) => {
      if (this.#suspendInfinateScroll) return;
      this.#config.onInfinateScroll(scrollingDoneCallback);
    };
  }

  createInfinateScrollProgress() {
    const loaderContainer = createElement("div", [
      "products-infinate-scroll-progress-container",
    ]);
    const loaderText = createElement("p", [
      "products-infinate-scroll-progress-text",
    ]);
    loaderText.append(createTextNode("Hold on, loading content"));
    const circularProgress = createOnsElement(
      "<ons-progress-circular indeterminate></ons-progress-circular>"
    );

    // console.log()
    loaderContainer.append(loaderText, circularProgress);
    return loaderContainer;
  }

  showInfinateScroll() {
    Promise.resolve(this.#page)
      .then((page) => {
        this.#infinateScrollProgress.style.display = "flex";
      })
      .catch((e) => e);
  }

  hideInfinateScroll() {
    Promise.resolve(this.#page)
      .then((page) => {
        this.#infinateScrollProgress.style.display = "none";
      })
      .catch((e) => e);
  }

  addInfiniteScrollEvent() {
    this.#page.onInfiniteScroll = this.onInfiniteScroll();
  }
  removeInfiniteScrollEvent() {
    this.#page.onInfiniteScroll = () => {};
  }
}
