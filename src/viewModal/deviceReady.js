import onsReady from "./onsReady";
import Splash from "../view/components/splashScreen";
import Loader from "../view/components/loader";
import ReloadApp from "../view/components/reload";
import { changeSite } from "../config";

// importing controllers
import categoryPageController from "./CategoriesPage/CategoriesPageController";
import loginController from "./Login/loginController";
import searchController from "./Search/searchController";
import homepageController from "./HomePage/homePageContrloler";
import cartController from "./Cart/cartController";
import accountController from "./Account/accountPageController";

//caching
import { setup } from "axios-cache-adapter";
import localforage from "localforage";
import memoryDriver from "localforage-memoryStorageDriver";
import FileCache from "../service/fileCacheAdaptor";
export default function deviceReady(event) {
  // console.log("deviceready called", event);
  // if (cordova.platformId === "android") {
  //   let sign = prompt("enter ip");
  //   if (sign) changeSite(sign);
  // }
  // lock portrate mode
  window.screen.orientation.lock("portrait");

  // populating window object with some global components
  window.splashscreen = new Splash();
  window.ajaxloader = new Loader();
  window.reloader = new ReloadApp();
  window.store = {
    categories: [],
    cart: {},
    user: {},
    sliderOffer: [],
    searchHistory: [],
  };

  window.activeNavigator = null;

  // init event get called when a page is rendered
  document.addEventListener("init", function (event) {
    // console.log("init called ", event);
    switch (event.target.id) {
      case "home":
        homepageController();
        break;
      case "catagoriesPage":
        categoryPageController();
        break;
      case "login":
        loginController();
        break;
      case "searchPage":
        searchController();
        break;
      case "cart":
        window.store.Cart = new cartController();
        break;
      case "account":
        accountController();
        break;
      default:
        break;
    }
  });

  // initialize the cache mechanism
  configureCache();
  setupImageCache();

  // attaching onsReady event
  ons.ready((e) => onsReady(e));
}

// create a new instance of the axios cache adapter
async function configureCache() {
  // Register the custom `memoryDriver` to `localforage`
  await localforage.defineDriver(memoryDriver);

  // Create `localforage` instance
  const forageStore = localforage.createInstance({
    // List of drivers used
    driver: [
      localforage.INDEXEDDB,
      localforage.LOCALSTORAGE,
      memoryDriver._driver,
    ],
    // Prefix all storage keys to prevent conflicts
    name: "my-cache",
  });

  window.api = setup({
    // `axios` options
    // baseURL: 'http://some-rest.api',

    // `axios-cache-adapter` options
    cache: {
      maxAge: 60 * 60 * 1000,
      store: forageStore, // Pass `localforage` store to `axios-cache-adapter`
      exclude: { query: false },
    },
  });

  return window.api;
}

// seup image cache

function setupImageCache() {
  return new Promise((resolve, reject) => {
    const cache = new FileCache({ resolve, reject });
    window.fileCacheAdaptor = cache;
  });
}
