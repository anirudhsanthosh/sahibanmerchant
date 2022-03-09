import { flexSlider, mockFlexSlider } from "./slider.js";
import {
  httpGetAsync,
  androidHttp,
  getWithBypassAES,
  getImage,
} from "./aesBypassing.js";
import { get as httpGet } from "./aesBypassing.js";
import {
  cratecategoryGrid,
  mockGrid,
  indexedCatagories,
  skeltonIndexedCategories,
} from "./categories.js";
import splash from "./includes/splashScreen.js";
import loader from "./includes/loader.js";
import reload from "./includes/reload.js";
import bottomNavigator from "./includes/bottomNavigation.js";
import browser from "./includes/inAppBrowser.js";

const SITE = "http://shoper.rf.gd";
const API_URL = "http://shoper.rf.gd/wp-json/";
const OFFER_NODE = "mam/v1/offers";
const CATEGORIES_NODE = "wc/store/products/categories";

// loaders
let splashScreen = new splash();
let ajaxloader = new loader();
let reloader = new reload();
let bottomNav = new bottomNavigator(SITE);

window.ajaxloader = ajaxloader;
window.splashScreen = splashScreen;
window.reloader = reloader;
window.bottomNav = bottomNav;
window.activeBrowser = null;
window.activeNavigator = null;
window.categories = [];

window.console.log = (e) => {}; // disabling console 😀

// init event get called when a page is rendered
document.addEventListener("init", function (event) {
  console.log("init called", event);
  switch (event.target.id) {
    case "catagoriesPage":
      let listHolder = document.getElementById("catagoriesPageDisplay");

      if (window.categories.length !== 0) {
        let catagoriesList = new indexedCatagories(
          listHolder,
          window.categories
        );
      } else {
        let dummy = new skeltonIndexedCategories(listHolder);
        document.addEventListener("categoriesDataParsed", (event) => {
          let catagoriesList = new indexedCatagories(listHolder, event.detail);
        });
      }
      break;
    case "searchPage":
      let input = document.getElementById("search-input");
      input.addEventListener("input", (e) => {
        console.log(e.target.value);
      });

      // when user hit go
      input.addEventListener("keypress", (e) => {
        if (e.key !== "Enter") return;
        if (!input.value) return;
        input.blur();
        // window.activeBrowser?.close?.();
        window.activeBrowser?.hide();
        window.activeBrowser = null;
        window.activeBrowser = new browser(
          `http://shoper.rf.gd/?s=${input.value}&post_type=product`
        );
      });

      // while user typing hide bottom nav
      input.addEventListener("focus", (e) => {
        window.bottomNav.hide();
      });
      input.addEventListener("blur", (e) => {
        window.bottomNav.show();
      });

      break;
    default:
      break;
  }
});

document.addEventListener("load", (event) => {
  console.log("load called", event);
});

// divice ready event

document.addEventListener("deviceready", (event) => {
  console.log("deviceready called", event);

  //// lock portrate mode
  window.screen.orientation.lock("portrait");

  ////////////// onsen ready event
  ons.ready((e) => {
    console.log("onsready called", e);
    navigator.splashscreen.hide();

    // building offer slider and category grid
    buildOfferSlider();
    showCategories();
    // accesing ons navigator
    window.activeNavigator = document.getElementById("navigator");

    reloader.hide();
    ajaxloader.hide(); // hiding loader
    setTimeout(() => {
      splashScreen.hide(); // hiding splashscreen animation
    }, 2000);

    // disabling ons backbuton handler
    ons.disableDeviceBackButtonHandler();

    // backbutton event
    document.addEventListener("backbutton", (event) => {
      console.log("backbutton", window.ajaxloader.visible, event);
      if (window.ajaxloader.visible) {
        event.preventDefault();
        console.log("not closing");
        return;
      }

      if (window.activeNavigator.topPage.id == "home")
        return navigator.app.exitApp();
      else window.activeNavigator.popPage();
    });
  });
});

// replace images

function replaceImages(data) {
  let result = [];
  data.forEach(async function (element) {
    let e = element;
    result.push(
      new Promise(async (resolve, reject) => {
        if (element.image) {
          let newUrl = new URL(e.image.src);
          newUrl.protocol = "http";
          let imageGeter = new getImage();
          let imgUrl = await imageGeter.get(newUrl.href);
          element.image.src = imgUrl;
          resolve(element);
        } else {
          resolve(element);
        }
      })
    );
  });
  return result;
}

// sort categories;

function sortCatagories(data) {
  let all = [];
  data.forEach((catagory) => {
    if (!all[catagory.parent]) all[catagory.parent] = [];
    all[catagory.parent].push(catagory);
  });

  return all;
}

function htmlDecode(input) {
  var e = document.createElement("textarea");
  e.innerHTML = input;
  // handle case of empty input
  return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

// showing catagories

async function showCategories() {
  let categoryShowcase = document.getElementById("catagoriesShowcase");
  let skeltonGridLoader = new mockGrid(categoryShowcase);
  // return;
  let url = API_URL + CATEGORIES_NODE;
  let data = new httpGet(url);
  data
    .then((response) => {
      try {
        let data = JSON.parse(response.data);
        data = replaceImages(data);
        Promise.all(data).then((data) => {
          let categoriesDisplayer = new cratecategoryGrid(
            categoryShowcase,
            data
          );
          window.categories = sortCatagories(data);
          let categoryDataEvent = new CustomEvent("categoriesDataParsed", {
            detail: window.categories,
          });

          document.dispatchEvent(categoryDataEvent);
        });
      } catch (e) {
        console.log(e);
        reloader.show();
      }
    })
    .catch((e) => {
      console.log("rejected");
      console.log(e);
      reloader.show();
    });
}

// building slider in home page
async function buildOfferSlider() {
  let flexSliderElement = "offerSlider-flex";
  // building skelton loader
  let skeltonLoadwr = new mockFlexSlider(flexSliderElement);
  let bypassGet = new getWithBypassAES();
  let images = await bypassGet
    .get(API_URL + OFFER_NODE)
    .then((response) => JSON.parse(response.data))
    .catch((err) => {
      console.log("error in index.js", err);
      reloader.show();
    });

  console.log(images);
  images = images.map(async (image) => {
    let newUrl = new URL(image);
    newUrl.protocol = "http";
    return newUrl.href;
  });

  Promise.all(images)
    .then((images) => {
      let newImages = images.map(async (image) => {
        let newImage = new getImage();
        let dataurl = await newImage.get(image);
        return dataurl;
      });

      Promise.all(newImages).then((newImages) => {
        let flexOfferSlider = new flexSlider(newImages, flexSliderElement);
      });
    })
    .catch((err) => {
      console.log(err);
      reloader.show();
    });
}
