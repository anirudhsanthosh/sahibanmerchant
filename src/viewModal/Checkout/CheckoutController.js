import Browser from "../../service/inappBrowser";
import { SITE, API_URL, CHECKOUT } from "../../config";
import userModal from "../../modal/user/userModal";
export default class ChekoutController {
  #browser;
  constructor() {}

  init() {
    return new Promise((resolve, reject) => {
      const url = SITE + "my-account/"; //"checkout/";
      const authHeader = userModal.getAuthHeader();
      const auth = userModal.getAuth();
      this.#browser = new Browser({ url, auth });
      // initiate browser and pass error or resolve to caller
      this.#browser
        .init()
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  destroy() {
    this.#browser.close();
  }
}
