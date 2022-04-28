import bottomNavigationUi from "../../view/components/bottomNavigation";
import NavigationController from "./navigationController";
import { PAGES, cartCountBadgeId } from "../../config";
import { createTextNode } from "../../utils/dom";

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
    id: "cart",
    active: false,
    indication: true,
    badge: true,
    badgeId: cartCountBadgeId,

    onclick: () => {
      NavigationController.validateActiveNavigator();
      window.activeNavigator.push(PAGES.cart).then((event) => {
        console.log("page has pushed to top", "eevent", event);
      });
    },
  },
  {
    name: "account",
    icon: "fa-user", //"md-account-circle",
    id: "account",
    active: false,
    indication: true,
    onclick: () => {
      NavigationController.validateActiveNavigator();
      window.activeNavigator.push(PAGES.account).then((event) => {
        console.log("page has pushed to top", event);
      });
    },
  },
];

export default function bottomNavigator() {
  return new bottomNavigationUi(buttons);
}

export function updateCartCount(count) {
  if (count === "" || count === undefined || count === null || isNaN(count))
    return;
  document.getElementById(cartCountBadgeId).innerHTML = "";
  document.getElementById(cartCountBadgeId).append(createTextNode(count));
  return;
}
