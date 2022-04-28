import accountPageMainView from "../../view/AccountPage/AcccountmainView";
import LogoutController from "../Logout/LogoutController";
import userModal from "../../modal/user/userModal";
import { toast } from "../../utils/notification";
import OrdersController from "../Orders/OrdersController";
export default function categoryPageController() {
  const props = formatDataForView();
  props.updateUser = updateUser;
  accountPageMainView(props);

  function formatDataForView() {
    const user = userModal.get();
    const displayName = user.displayName;
    const email = user.email;
    const firstName = user.firstName;
    const lastName = user.lastName;
    const phone = user.phone;
    const logout = LogoutController;
    const ordersButtonOnClick = () => new OrdersController();
    return {
      displayName,
      email,
      firstName,
      lastName,
      phone,
      logout,
      ordersButtonOnClick,
    };
  }

  function updateUser(data = {}) {
    return new Promise((resolve, reject) => {
      if (!data.firstName) return reject("First Name is required");
      if (!data.lastName) return reject("Last Name is required");
      if (!data.email) return reject("Email is required");
      if (!data.displayName) return reject("Display Name is required");
      if (!data.phone) return reject("Phone is required");

      const user = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        displayName: data.displayName,
        phone: data.phone,
      };

      //todo validate
      const headers = userModal.getAuthHeader();
      userModal
        .update(user, headers)
        .then((res) => {
          if (res.error) throw new Error(res.error);
          toast("Details updated successfully");
          resolve(formatDataForView());
        })
        .catch((err) => {
          reject(err);
          console.log({ err });
        });
    });
  }
}
