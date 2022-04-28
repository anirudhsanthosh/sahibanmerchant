import orders from "../../modal/Orders/OrdersModal";
import offers from "../../modal/offers/OffersModal";
import coupons from "../../modal/coupons/couponsModal";
import userModal from "../../modal/user/userModal";
import cartModal from "../../modal/cart/cartModal";
import categoriesModal from "../../modal/categories/categoriesModal";

// this will save all data retrieved at time of user credential verification
//TODO handle save data error
export default function MainDataController(data) {
  if (data?.data?.user) userModal.set(data?.data?.user);

  // settng orders
  if (data?.data?.orders) orders.set(data.data.orders);

  //offers
  if (data?.data?.offers) offers.set(data?.data?.offers);

  //coupons
  if (data?.data?.coupons) coupons.set(data?.data?.coupons);

  // set cart item count
  if (data?.data?.cart?.total_items)
    cartModal.setCartItemCount(data?.data?.cart?.total_items);

  //categories

  if (data?.data?.categories) categoriesModal.set(data?.data?.categories);

  //nonce
  if (data?.data?.store_nonce) userModal.setNonce(data?.data?.store_nonce);

  return true;
}
