import categoriesModal from "../../modal/categories/categoriesModal";

import { HOMEPAGE_TOP_CATEGORY_SECTION_ID_ } from "../../config";
import { isEmpty } from "validator";
import { removeElement } from "../../utils/dom";
import ProductsController from "../Products/ProductsController";

// views
import topCategoriesView from "../../view/Homepage/topCategoriesView";

export default async function topCategoriesSliderController() {
  const categories = categoriesModal.get();

  const topCategories = categories.filter(
    (category) =>
      category.parent === 0 &&
      category.name !== "Uncategorized" &&
      isEmpty(category.name) === false
  );

  if (
    !topCategories ||
    topCategories.length === 0 ||
    !(topCategories instanceof Array)
  ) {
    removeElement(
      document.getElementById(HOMEPAGE_TOP_CATEGORY_SECTION_ID_).parentElement
    );
    return;
  }

  const slides = topCategories.map((category) => {
    const slide = { ...category, onClick: () => SlideOnClick(category) };
    return slide;
  });

  new topCategoriesView({
    topCategories: slides,
    topCategoriesContainer: HOMEPAGE_TOP_CATEGORY_SECTION_ID_,
  });
  return;
}

function SlideOnClick(category) {
  if (category.id)
    return new ProductsController({
      query: {
        title: category.name ?? "",
        category: category.id,
      },
    });
}
