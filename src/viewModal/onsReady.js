// import loginController from "./Login/loginController";
import { ONS_NAVIGATOR_ID, PAGES } from "../config";
import Navigator from "../service/navigator";
import NavigationController from "./Navigation/navigationController";
import { toast } from "../utils/notification";

export default function onsReady(e) {
  // hiding cordobva splashscreen
  window.navigator.splashscreen.hide();

  // disabling ons backbuton handler
  ons.disableDeviceBackButtonHandler();

  // backbutton event
  document.addEventListener("backbutton", (event) => {
    if (window.ajaxloader.visible) {
      event.preventDefault();
      return;
    }

    if (window.activeNavigator.topPage.id == "home") {
      if (window?.exitappCalled) return navigator.app.exitApp();
      window.exitappCalled = true;
      setTimeout(() => (window.exitappCalled = undefined), 2000);
      toast("Press back button again for exit.", 1800);
      return;
    } else NavigationController.pop();
  });

  // hiding all loaders and splash screen
  setTimeout(() => {
    window.splashscreen.hide(); // hiding splashscreen animation
  }, 2000);

  // accesing ons navigator and populating window obj
  window.activeNavigator = new Navigator(ONS_NAVIGATOR_ID);

  // goto loginPage
  NavigationController.resetToLogin();
}
