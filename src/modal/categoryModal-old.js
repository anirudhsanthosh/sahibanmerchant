import { SITE, API_URL, CATEGORIES_NODE } from "../config";

export default async function categoriesModal() {
  try {
    const data = await axios.get(SITE + API_URL + CATEGORIES_NODE);
    /**
     * creating a custom event for categories page
     */
    window.store.categories = data.data ? data.data : [];
    let categoryDataEvent = new CustomEvent("categoriesDataParsed", {
      detail: data.data,
    });
    document.dispatchEvent(categoryDataEvent);
    return data;
  } catch (e) {
    return { error: e };
  }
}
