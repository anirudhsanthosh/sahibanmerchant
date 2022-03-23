import loginView from "../view/loginView";
import { isPassBasicValidation } from "../utils/validator";
import loginModal from "../modal/loginModal";
import userModal from "../modal/userModal";
import cartModal from "../modal/cartModal";
import { PAGES } from "../config";

export default function loginController() {
  let alert;

  function handleLoginError(errorCode) {
    switch (errorCode) {
      case "":
        alert(
          "Server busy!, unable to login please try again after some time",
          "#ff0000"
        );
        break;
      case "invalid_username":
        alert("Invalid Username", "#ff0000");
        break;
      case "incorrect_password":
        alert("Incorrect password", "#ff0000");
        break;
      default:
        break;
    }
  }

  let onLoginButtonClick = async (username, password) => {
    if (!isPassBasicValidation(username))
      return alert("Please fill out username");
    if (!isPassBasicValidation(password))
      return alert("Please fill out password");

    // showing ajax loader
    window.ajaxloader.show();

    // calling modal for login status
    let data = await loginModal(username, password);

    // if error hide ajax loader and show error message
    if (data.error) {
      handleLoginError(data.error?.response?.data?.code);
      window?.ajaxloader.hide();
      return;
    }

    // no error and data recieved

    userModal.setAuth({ username, password });
    userModal.set(data?.data);

    window.user = data?.data;

    let cart = await cartModal.get(userModal.getAuthHeader())?.data;
    window.cart = cart;

    try {
      window.activeNavigator.reset(PAGES.home);
    } catch (e) {
      throw new Error(`faild to load page:${PAGES.home}, error:${e}`);
    }
    window.ajaxloader.hide();
  };

  //populating alert variable
  alert = loginView(onLoginButtonClick);
}
