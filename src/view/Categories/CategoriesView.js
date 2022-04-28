import { CATEGORY_PAGE_DISPLAY_ROOT_ID } from "../../config";
import { createElement } from "../../utils/dom";
import { decodeHtml } from "../../utils/sanitize";
import ProductsController from "../../viewModal/Products/ProductsController";

export default class CategoriesView {
  constructor(config) {
    if (!document.getElementById(CATEGORY_PAGE_DISPLAY_ROOT_ID)) return;

    for (const categories in config.categories) {
      const catCards = config.categories[categories].map((cat) => {
        return this.categoryCard({
          name: decodeHtml(cat.name),
          image: cat?.image?.src,
          onclick: () => {
            new ProductsController({
              query: {
                title: cat.name ?? "",
                category: cat.id,
              },
            });
          },
        });
      });

      const card = this.card(decodeHtml(categories), catCards);
      document.getElementById(CATEGORY_PAGE_DISPLAY_ROOT_ID).append(card);
    }
  }

  card(name, children) {
    const card = createElement("div", ["categories-card"]);
    const title = createElement("div", ["categories-card-title"]);
    title.append(name);
    const slider = this.slider();
    slider.append(...children);
    card.append(title, slider);
    return card;
  }

  slider() {
    return createElement("div", ["flex-slider"]);
  }

  categoryCard(cat) {
    const card = createElement("div", ["category-card"]);
    const imageContainer = createElement("div", [
      "category-card-image-container",
    ]);
    if (cat.image) {
      const image = createElement("img", [], { loading: "lazy" });

      window.fileCacheAdaptor
        .get(cat.image)
        .then((url) => (image.src = url))
        .catch(() => (image.src = cat.image));

      imageContainer.append(image);
    }
    const nameContainer = createElement("div", [
      "category-card-name-container",
    ]);

    nameContainer.append(cat.name);
    card.append(imageContainer, nameContainer);
    card.onclick = cat.onclick;
    return card;
  }
}
