import CategoriesView from "../../view/Categories/CategoriesView";
import categoriesModal from "../../modal/categories/categoriesModal";

export default function categoryPageController() {
  const categories = categoriesModal.getOrdered();
  const config = {
    categories,
  };
  const page = new CategoriesView(config);

  return null;
}
