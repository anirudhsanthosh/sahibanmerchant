import Browser from "../../service/inappBrowser";
import { SITE, API_URL, CHECKOUT } from "../../config";
import userModal from "../../modal/user/userModal";
export default class ChekoutController {
  constructor() {}

  init() {
    return new Promise((resolve, reject) => {
      const url = SITE + API_URL + "checkout/";
      const authHeader = userModal.getAuthHeader();
      const browser = new Browser({ url, headers: authHeader });
    });
  }
}
