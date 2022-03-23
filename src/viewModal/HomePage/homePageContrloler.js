//views
import mainSkeltonView from "../../view/mainSkeltonView";

//controllers
import offerSlider from "./offerSliderController";
import homepageCategoryShowcase from "./homePageCategoryController";
import bottomNavigator from "../bottomNavigationController";

export default function homepageController() {
  // invoking skelton views
  mainSkeltonView();

  // creating offer slider
  offerSlider();

  // showing all categories
  homepageCategoryShowcase();

  //bottom nav button
  bottomNavigator();
}
