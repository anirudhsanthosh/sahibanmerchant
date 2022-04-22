//views
import mainSkeltonView from "../../view/mainSkeltonView";

//controllers
import topCategoriesSliderController from "./topCategoriesController";
import offerSlider from "./offerSliderController";
import bottomNavigator, {
  updateCartCount,
} from "../Navigation/bottomNavigationController";
import NavgationController from "../Navigation/navigationController";
import LogoutController from "../Logout/LogoutController";
import OffersController from "./OffersController";

// modals
import CartModal from "../../modal/cart/cartModal";
import userModal from "../../modal/user/userModal";
import LoginModal from "../../modal/login/loginModal";
import dataController from "../DataController/mainDataController";

export default function homepageController() {
  //bottom nav button
  window.bottomNavigator = bottomNavigator();

  // build view from cache
  buildView();

  // check fresh login or not
  const isNewLogin = NavgationController?.topPageData?.newLogin;

  // verify previous sesion is valid and get user data along with other data
  if (!isNewLogin) verifyUserCredentialsAndBuildView();
}

function buildView() {
  // invoking skelton views
  mainSkeltonView();

  // creating offer slider
  offerSlider();

  // show top categories
  topCategoriesSliderController();

  // other offers
  OffersController();

  // update cart item count
  const cartItemCount = CartModal.getCachedCartItemCount() || 0;
  updateCartCount(cartItemCount);
}

async function verifyUserCredentialsAndBuildView() {
  const credentials = userModal.getAuth();

  const data = await LoginModal(credentials.username, credentials.password);
  console.log({ dataFromVerify: data });
  if (data?.error?.response?.status <= 500) {
    alert("Unable to contact server!");
    return;
  }
  if (data?.error?.response?.status <= 400) {
    LogoutController();
    return;
  }
  if (data?.error) {
    alert("Network Error!");
  }

  const saveData = dataController(data);
  if (!saveData) console.log("error in saving data"); //TODO handle error

  // build view from new data
  buildView();
}
