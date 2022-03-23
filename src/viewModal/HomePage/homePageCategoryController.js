import getCategories from "../../modal/categoryModal";
import { HOMEPAGE_CATEGORY_SECTION_ID } from "../../config";
// views
import { cratecategoryGrid } from "../../view/components/categories";

export default async function offerSliderController() {
  const request = await getCategories();

  if (request.error) {
    //TODO implement exeption handling
    console.log("err", request.error);
    return;
  }

  const tiles = request.data;
  console.log(tiles);
  new cratecategoryGrid(
    document.getElementById(HOMEPAGE_CATEGORY_SECTION_ID),
    tiles
  );
}
