import { skeltonIndexedCategories } from "../../view/components/categories";
import { CATEGORY_PAGE_DISPLAY_ROOT_ID } from "../../config";
export default function categoryPageController() {
  if (window?.store?.categories?.length !== 0) {
    console.log(window?.store?.categories);
  } else {
    let dummy = new skeltonIndexedCategories(CATEGORY_PAGE_DISPLAY_ROOT_ID);
    document.addEventListener("categoriesDataParsed", (event) => {
      console.log(event.detail);
      // new indexedCatagories(listHolder, event.detail);
    });
  }

  return null;
}
