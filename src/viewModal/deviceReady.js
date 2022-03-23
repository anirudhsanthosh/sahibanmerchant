import onsReady from "./onsReady";
import Splash from "../view/components/splashScreen";
import Loader from "../view/components/loader";
import ReloadApp from "../view/components/reload";

export default function deviceReady(event) {
  console.log("deviceready called", event);

  //// lock portrate mode
  window.screen.orientation.lock("portrait");

  // populating window object with some global components
  window.splashscreen = new Splash();
  window.ajaxloader = new Loader();
  window.reloader = new ReloadApp();
  window.cart = null;
  window.user = null;

  window.activeNavigator = null;
  window.categories = [];

  // attaching onsReady event
  ons.ready((e) => onsReady(e));
}
