import { API_URL, SITE, PRODUCTS_NODE } from "../../config";
import { toQueryString } from "../../utils/serialize";

export default class ProductsModal {
  static async getProducts(auth, query) {
    try {
      const queryString = toQueryString(query);
      const url = SITE + API_URL + PRODUCTS_NODE + "?" + queryString;

      // const data = await axios.get(url, {
      //   headers: {
      //     ...auth,
      //   },
      // });

      // use catched method available on window.api
      const data = await window.api.get(url, {
        // params: query,
        headers: {
          ...auth,
        },
      });
      return data.data;
    } catch (e) {
      return { error: e };
    }
  }
}
