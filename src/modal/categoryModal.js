import { SITE, API_URL, CATEGORIES_NODE } from "../config";

export default async function categoriesModal() {
  try {
    const data = await axios.get(SITE + API_URL + CATEGORIES_NODE);
    return data;
  } catch (e) {
    return { error: e };
  }
}
