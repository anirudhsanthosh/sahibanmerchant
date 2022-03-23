import { PAGES } from "../config";
import homepageController from "./HomePage/homePageContrloler";

export default class NavigationController {
  static async resetToHome() {
    let home;
    try {
      home = await window.activeNavigator.reset(PAGES.home);
      homepageController();
    } catch (e) {
      // TODO
      return e;
    }
    return home;
  }
  static resetToLogin() {
    return window.activeNavigator.reset(PAGES.login);
  }
  static push(page) {
    return window.activeNavigator.bringPageTop(page);
  }
  static pop() {
    return window.activeNavigator.pop();
  }

  static validateActiveNavigator() {
    window.activeNavigator =
      window.activeNavigator ?? new NavigationController();
  }
}
