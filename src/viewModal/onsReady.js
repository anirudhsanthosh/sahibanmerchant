import loginController from "./loginController";
import { ONS_NAVIGATOR_ID } from "../config";
import Navigator from "../service/navigator";
export default function onsReady(e) {
  // hiding cordobva splashscreen
  window.navigator.splashscreen.hide();

  // accesing ons navigator and populating window obj
  window.activeNavigator = new Navigator(ONS_NAVIGATOR_ID); //document.getElementById("navigator");

  // disabling ons backbuton handler
  ons.disableDeviceBackButtonHandler();

  // backbutton event
  document.addEventListener("backbutton", (event) => {
    if (window.ajaxloader.visible) {
      event.preventDefault();
      console.log("not closing");
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

  // invoking login controller
  loginController();
}
