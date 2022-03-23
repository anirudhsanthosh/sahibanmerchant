import getOfferSliderImages from "../../modal/offerSliderModal";
import { OFFER_SLIDER } from "../../config";
// views
import { flexSlider as FlexSlider } from "../../view/components/slider";

export default async function offerSliderController() {
  const request = await getOfferSliderImages();
  if (request.error) {
    //TODO implement exeption handling
    console.log("err", request.error);
    return;
  }
  const slides = request.data;
  new FlexSlider(slides, OFFER_SLIDER);
}
