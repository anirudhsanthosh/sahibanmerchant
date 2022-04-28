import userModal from "../../modal/user/userModal";
import NavigationController from "../Navigation/navigationController";
import Browser from "../../service/inappBrowser";
import { SITE } from "../../config";

export default function LogoutController() {
  userModal.setAuth({});
  userModal.set({});
  localStorage.clear();
  window.bottomNavigator.destroy();
  NavigationController.resetToLogin();
  new Browser({ url: SITE, logouting: true });
}
