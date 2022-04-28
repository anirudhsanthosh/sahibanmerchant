import ForgotPasswordView from "../../view/ForgotPassword/ForgotPasswordView";
import NavigationController from "../Navigation/navigationController";
import validator from "validator";
import userModal from "../../modal/user/userModal";

export default class ForgotPaswordController {
  constructor() {
    this.init();
  }
  init() {
    this.view = new ForgotPasswordView({
      onBackToLoginButtonClick: this.onBackToLoginButtonClick,
      onForgotPasswordButtonClick: this.onForgotPasswordButtonClick,
    });
  }

  onBackToLoginButtonClick = () => {
    NavigationController.resetToLogin();
  };

  onForgotPasswordButtonClick(fields) {
    const fieldValidator = {
      user_login: validator.isEmpty,
    };
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
        .forgotPassword(data)
        .then((res) => {
          resolve(res);
          console.log({ res });
        })
        .catch((err) => {
          reject(err);
          console.log({ err });
        });
    });
  }
}
