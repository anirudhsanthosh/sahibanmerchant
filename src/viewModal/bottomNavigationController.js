import bottomNavigationUi from "../view/components/bottomNavigation";
export default function bottomNavigator() {
  const buttons = [
    {
      name: "home",
      icon: "md-home",
      id: "home",
      active: true,
      indication: true,
      onclick: () => {
        // window.activeBrowser?.close?.();
        window.activeBrowser?.hide();
        window.activeBrowser = null;
        window.activeNavigator =
          window.activeNavigator ?? document.getElementById("navigator");
        window.activeNavigator.bringPageTop("pages/home.html").then((event) => {
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
        window.activeBrowser?.hide();
        window.activeBrowser = null;
        window.activeNavigator =
          window.activeNavigator ?? document.getElementById("navigator");
        window.activeNavigator
          .bringPageTop("pages/catagories.html")
          .then((event) => {
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
        window.activeNavigator =
          window.activeNavigator ?? document.getElementById("navigator");
        window.activeNavigator
          .bringPageTop("pages/search.html")
          .then((event) => {
            console.log("page has pushed to top", event);
          });
      },
    },

    {
      name: "cart",
      icon: "fa-shopping-basket", //"md-shopping-cart",
      active: false,
      indication: false,
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
  return new bottomNavigationUi(buttons);
}
