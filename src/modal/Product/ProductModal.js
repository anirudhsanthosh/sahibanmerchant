import { API_URL, SITE, PRODUCT_NODE } from "../../config";
import { toQueryString } from "../../utils/serialize";

export default class ProductModal {
  static async getProductWithId(auth, id) {
    try {
      const url = SITE + API_URL + PRODUCT_NODE + id;

      // const data = await axios.get(url, {
      //   headers: {
      //     ...auth,
      //   },
      // });

      // with caching enabled use window.api for cachig

      const data = await window.api.get(url, {
        headers: {
          ...auth,
        },
      });

      console.log(data.data);

      return data.data;
    } catch (e) {
      return { error: e };
    }
  }
}
