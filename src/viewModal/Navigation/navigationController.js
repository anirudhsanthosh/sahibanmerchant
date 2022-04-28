import { PAGES, ONS_NAVIGATOR_ID } from "../../config";
import homepageController from "../HomePage/homePageContrloler";
import Navigator from "../../service/navigator";

export default class NavigationController {
  static async resetToHome(config = {}) {
    const options = {
      data: config,
    };
    let home;
    try {
      home = await window.activeNavigator.reset(PAGES.home, options);
    } catch (e) {
      // TODO
      return e;
    }
    return home;
  }
  static resetToLogin(config = {}) {
    const options = {
      data: config,
    };
    return window.activeNavigator.reset(PAGES.login, options);
  }
  static push(page) {
    return window.activeNavigator.bringPageTop(page);
  }
  static pop() {
    return window.activeNavigator.pop();
  }

  static validateActiveNavigator() {
    window.activeNavigator =
      window.activeNavigator ?? new Navigator(ONS_NAVIGATOR_ID);
  }

  static get topPage() {
    return window.activeNavigator.topPage;
  }

  static get topPageData() {
    return window.activeNavigator.topPage.data;
  }

  static get pages() {
    return window.activeNavigator.pages;
  }
  // static removeAllpagesFromStack(){
  //   const pages = this.pages();
  //   pages.map((page,index)=> {
  //     if(page.id !== 'home') window.activeNavigator.remove(index);

  //   })
  // }
}
