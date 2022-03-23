import bottomNavigationUi from "../view/components/bottomNavigation";
import NavigationController from "./navigationController";
import { PAGES } from "../config";
const cartCountBadgeId = "cart-count";

const buttons = [
  {
    name: "home",
    icon: "md-home",
    id: "home",
    active: true,
    indication: true,
    onclick: () => {
      NavigationController.validateActiveNavigator();
      window.activeNavigator.push(PAGES.home).then((event) => {
        console.log("page has pushed to top", event);
      });
    },
  },
  {
    name: "categories",
    icon: "md-apps",
    id: "catagoriesPage",
    active: false,
    indication: true,
    onclick: () => {
      NavigationController.validateActiveNavigator();
      window.activeNavigator.push(PAGES.catagories).then((event) => {
        console.log("page has pushed to top", event);
      });
    },
  },
  {
    name: "search",
    icon: "fa-search", //"md-shopping-cart",
    id: "searchPage",
    active: false,
    indication: true,
    postpush: () => {
      document.getElementById("search-input").focus();
    },
    onclick: () => {
      NavigationController.validateActiveNavigator();
      window.activeNavigator.push(PAGES.search).then((event) => {
        console.log("page has pushed to top", event);
      });
    },
  },

  {
    name: "cart",
    icon: "fa-shopping-basket", //"md-shopping-cart",
    active: false,
    indication: false,
    badge: true,
    badgeId: cartCountBadgeId,

    onclick: () => {
      // window.activeBrowser?.close?.();
      window.activeBrowser?.hide();
      window.activeBrowser = null;
      window.activeBrowser = new browser("http://shoper.rf.gd/cart/");
    },
  },
  {
    name: "account",
    icon: "fa-user", //"md-account-circle",
    active: false,
    indication: false,
    onclick: () => {
      // window.activeBrowser?.close?.();
      window.activeBrowser?.hide();
      window.activeBrowser = null;
      window.activeBrowser = new browser("http://shoper.rf.gd/my-account/");
    },
  },
];

export default function bottomNavigator() {
  return new bottomNavigationUi(buttons);
}

export function updateCartCount(count) {
  if (!count || isNaN(count)) return;
  return (document.getElementById(cartCountBadgeId).innerHTML = count);
}
