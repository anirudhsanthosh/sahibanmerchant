//views
import mainView from "../view/mainView";

//controllers
import offerSlider from "./offerSliderController";
import homepageCategoryShowcase from "./homePageCategoryController";
import bottomNavigator from "./bottomNavigationController";

export default function homepageController() {
  // invoking main view skelton views
  mainView();

  // creating offer slider
  offerSlider();

  // showing all categories
  homepageCategoryShowcase();

  //bottom nav button
  bottomNavigator();
}
