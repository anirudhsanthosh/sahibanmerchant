import { HOMEPAGE_CONTENT_ELEMENT_SELECTOR } from "../../config";
import OffersModal from "../../modal/offers/OffersModal";
import ProductsController from "../Products/ProductsController";

//modal
import CategoriesModal from "../../modal/categories/categoriesModal";

//view

import OfferCardView from "../../view/Homepage/offerCardView";

export default function OffersController() {
  // remove all content from container
  document.querySelector(HOMEPAGE_CONTENT_ELEMENT_SELECTOR).innerHTML = "";

  // get all offes
  const offers = OffersModal.get();
  if (!offers || offers.length === 0 || !(offers instanceof Array)) return;

  // filter offers which are not type images and doesnot have any data within it
  const filteredOffers = offers.filter((offer) => {
    // this controller is not for image type offrs
    if (offer?.type === "image") return false;
    // check categoriies and products are available, else  return false hence nothing to show
    if (!offer.products && !offer.categories) return false;

    //if product exist but details are not available return false
    if (
      offer.products &&
      (!offer.products_detail_list ||
        !Array.isArray(offer.products_detail_list) ||
        offer.products_detail_list.length === 0)
    )
      return false;

    return true;
  });

  filteredOffers.map((offer) => {
    // when user want to seee more details about offer
    // supply product list

    // onclick of more button

    const moreButtonOnclick = () => {
      const config = {
        query: {
          title: offer?.title,
          include: offer.products,
        },
      };
      new ProductsController(config);
    };

    // format each products for showing as card

    const formattedProducts = formatProductForProductCard(
      offer.products_detail_list
    );

    // format each categories for showing as card
    const categories = !offer.categories ? [] : offer.categories.split(",");
    const formatedCategories = formatCategoriesForProductCard(categories);

    // configration for the card
    const options = {
      title: offer?.title,
      description: offer?.description,
      products: offer?.products,
      formattedProducts,
      formatedCategories,
      categories: offer?.categories,
      moreButtonOnclick,
      cardContainer: HOMEPAGE_CONTENT_ELEMENT_SELECTOR,
    };

    // show actiual card
    new OfferCardView(options);
  });
}

function formatCategoriesForProductCard(categories) {
  if (!categories || !Array.isArray(categories) || categories.length === 0)
    return [];

  return categories.map((category) => {
    const categoryData = CategoriesModal.get(category);
    if (!categoryData) return;

    const gotoCategoryPage = () => {
      // if this category is clicked launch products page with this category
      new ProductsController({
        query: {
          title: categoryData.name ?? "",
          category: categoryData.id,
        },
      });
    };

    // config for product

    const formattedCategory = {
      text: categoryData.name,
      onClick: gotoCategoryPage,
    };

    return formattedCategory;
  });
}

function formatProductForProductCard(products) {
  if (!products || !Array.isArray(products) || products.length === 0) return [];

  return products.map((product) => {
    const gotoProductPage = () => {
      console.log(product);
    };

    // config for product

    const regularPrice =
      product.type === "variable"
        ? product.variable_price.max_price
        : product.regular_price;
    const selePrice =
      product.type === "variable"
        ? product.variable_price.min_price
        : product.sale_price;
    const discountInPercentage =
      100 - Math.floor((selePrice / regularPrice) * 100);

    const formattedProduct = {
      title: product.name,
      onSale: product.on_sale,
      regularPrice,
      selePrice,
      image: product.thumbnail,
      discountInPercentage,
      onclick: gotoProductPage,
    };

    return formattedProduct;
  });
}