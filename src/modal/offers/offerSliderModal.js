// import { SITE, API_URL, OFFER_NODE } from "../config";

// export default async function offerSliderModal() {
//   try {
//     const data = await axios.get(SITE + API_URL + OFFER_NODE);
//     return data;
//   } catch (e) {
//     return { error: e };
//   }
// }
import OffersModal from "./OffersModal";

export default class OfferSliderModal extends OffersModal {
  static getImageTypeOffersFromCache() {}
}
