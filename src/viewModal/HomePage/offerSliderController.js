import OffersModal from "../../modal/offers/OffersModal";
import { OFFER_SLIDER } from "../../config";
import { isEmpty } from "validator";

import ProductsController from "../Products/ProductsController";

// views
import { flexSlider as FlexSlider } from "../../view/components/slider";

export default async function offerSliderController() {
  const offers = OffersModal.get();
  if (!offers || offers.length === 0 || !(offers instanceof Array)) {
    removeElement(document.getElementById(OFFER_SLIDER).parentElement);
    return;
  }
  const imageTypeOffers = offers.filter(
    (offer) =>
      offer?.image &&
      offer?.type === "image" &&
      offer?.image != null &&
      offer?.image != ""
  );

  const slides = imageTypeOffers.map((offer) => {
    const slide = {
      image: isEmpty(offer?.image) ? null : offer?.image,
      title: isEmpty(offer?.title) ? null : offer?.title,
      description: isEmpty(offer?.description) ? null : offer?.description,
      onClick: () => SlideOnClick(offer),
      products: isEmpty(offer?.products) ? null : offer?.products,
      categories: isEmpty(offer?.categories) ? null : offer?.categories,
    };

    return slide;
  });

  new FlexSlider(slides, OFFER_SLIDER);
  return;
}

function SlideOnClick(offer) {
  if (offer.products)
    return new ProductsController({
      query: {
        include: offer.products,
      },
    });
  if (offer.categories)
    return new ProductsController({
      query: {
        category: offer.categories,
      },
    });

  console.log("todo"); //TODO
}
