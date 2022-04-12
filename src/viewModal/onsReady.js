import loginController from "./Login/loginController";
import { ONS_NAVIGATOR_ID, PAGES } from "../config";
import Navigator from "../service/navigator";
import NavigationController from "./Navigation/navigationController";

export default function onsReady(e) {
  // hiding cordobva splashscreen
  window.navigator.splashscreen.hide();

  // disabling ons backbuton handler
  ons.disableDeviceBackButtonHandler();

  // backbutton event
  document.addEventListener("backbutton", (event) => {
    if (window.ajaxloader.visible) {
      event.preventDefault();
      // console.log("not closing");
      return;
    }

    if (window.activeNavigator.topPage.id == "home")
      return navigator.app.exitApp();
    else window.activeNavigator.popPage();
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
