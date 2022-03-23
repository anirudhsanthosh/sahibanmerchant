import LoginView, { alert } from "../view/loginView";
import { isPassBasicValidation } from "../utils/validator";
import loginModal from "../modal/loginModal";
import userModal from "../modal/userModal";
import cartModal from "../modal/cartModal";
import { PAGES } from "../config";
import NavigationController from "./navigationController";

export default async function loginController() {
  // if previously logged in and that credentials is valid move to home
  if (isPreviouslyLoggedDataValid()) {
    try {
      await NavigationController.resetToHome();
    } catch (e) {
      //TODO
    }
    return;
  }

  LoginView(onLoginButtonClick);
}

export function isPreviouslyLogged() {
  return userModal.getAuth();
}

export function isPreviouslyLoggedDataValid() {
  if (!isPreviouslyLogged()) return false;
  //TODO
  return true;
}

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
  } catch (e) {
    throw new Error(`faild to load page:${PAGES.home}, error:${e}`);
  }
  window.ajaxloader.hide();
};
