import NavigationController from "../Navigation/navigationController";
import { PAGES } from "../../config";
import validator from "validator";

import SignUpView from "../../view/SignUp/SignUp";
import userModal from "../../modal/user/userModal";
export default class SignUpController {
  #view;
  constructor() {
    this.init();
  }
  init() {
    activeNavigator.push(PAGES.signUp).then(() => {
      const props = {
        onSignUpButtonClick: this.onSignUpButtonClick(),
        // onLoginButtonClick:
        // onForgotPasswordButtonClick:
      };
      this.#view = new SignUpView(props);
    });
  }

  onSignUpButtonClick() {
    const fieldValidator = {
      firstName: validator.isEmpty,
      lastName: validator.isEmpty,
      email: (value) => !validator.isEmail(value) || validator.isEmpty(value),
      password: validator.isEmpty,
      confirmpassword: validator.isEmpty,
      phone: (value) => !validator.isMobilePhone(value, "en-IN"),
      username: validator.isEmpty,
    };

    return (fields) => {
      return new Promise((resolve, reject) => {
        const error = fields.filter((field) => {
          return fieldValidator[field.id](field.value);
        });
        if (error.length > 0) return reject(error);
        const data = {};
        fields.map((field) => {
          data[field.id] = field.value;
        });
        userModal
          .register(data)
          .then((res) => {
            resolve(res);
            console.log({ res });
          })
          .catch((err) => {
            reject(err);
            console.log({ err });
          });
      });
    };
  }
}
