import LoginView, { alert } from "../../view/loginView";
import { isPassBasicValidation } from "../../utils/validator";
import loginModal from "../../modal/login/loginModal";
import userModal from "../../modal/user/userModal";

// controller
import dataController from "../DataController/mainDataController";

import { PAGES } from "../../config";
import NavigationController from "../Navigation/navigationController";

export default async function loginController() {
  // if previously logged in and that credentials is valid go to home

  if (isPreviouslyLoggedDataValid()) {
    try {
      const config = {
        newLogin: false,
      };
      await NavigationController.resetToHome(config);
    } catch (e) {
      //TODO
    }
    return;
  }

  LoginView(
    onLoginButtonClick,
    onSignupButtonClick,
    onForgotPasswordButtonClick
  );
}

export function isPreviouslyLogged() {
  return userModal.getAuth();
}

export function isPreviouslyLoggedDataValid() {
  return isPreviouslyLogged();
}

function handleLoginError(errorCode) {
  switch (errorCode) {
    case "":
      alert(
        "Server is busy!, unable to login please try again after some time",
        "#ff0000"
      );
      break;
    case "invalid_username":
      alert("Invalid Username", "#ff0000");
      break;
    case "incorrect_password":
      alert("Incorrect password", "#ff0000");
      break;
    case "invalid_email":
      alert("Invalid email", "#ff0000");
      break;
    default:
      alert(
        "Unable to contact server, please try again after some time",
        "#ff0000"
      );
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

  // saving user data
  userModal.setAuth({ username, password });
  const saveData = dataController(data);
  if (!saveData) console.log("error in saving data"); //TODO handle error

  // redirect to homepage
  try {
    const config = {
      newLogin: true,
    };
    await NavigationController.resetToHome(config);
  } catch (e) {
    throw new Error(`faild to load page:${PAGES.home}, error:${e}`);
  }
  window.ajaxloader.hide();
};

let onSignupButtonClick = async () => {
  console.log("goto signup");
};
let onForgotPasswordButtonClick = async () => {
  console.log("goto forgot password");
  window.scrollTo(500, 0);
};
