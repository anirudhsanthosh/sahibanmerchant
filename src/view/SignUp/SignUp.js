import { toast } from "../../utils/notification";
import NavigationController from "../../viewModal/Navigation/navigationController";

export default class SignupView {
  #onLoginButtonClick;
  #onForgotPasswordButtonClick;
  constructor({
    onSignUpButtonClick,
    onLoginButtonClick,
    onForgotPasswordButtonClick,
  }) {
    this.signUpButtonClick = onSignUpButtonClick;
    this.#onLoginButtonClick = onLoginButtonClick;
    this.#onForgotPasswordButtonClick = onForgotPasswordButtonClick;
    this.init();
  }
  init() {
    const page = document.querySelector("#signup");
    this.page = page;
    if (!page) return;

    page
      .querySelector("#signUp-button")
      .addEventListener("click", this.onSignUpButtonClick);
    page
      .querySelector("#backtologinButton")
      .addEventListener("click", this.onBackToLoginButtonClick);
  }

  onBackToLoginButtonClick = () => {
    NavigationController.resetToLogin();
  };

  onSignUpButtonClick = () => {
    const form = this.page.querySelector("#signup-form");
    const inputs = [...form.querySelectorAll("ons-input")].map((input) => {
      input.classList.remove("invalid");
      return {
        id: input.id,
        value: input.value,
      };
    });
    this.signUpButtonClick(inputs)
      .then((res) => {
        if (res.error) throw new Error(res.error.response.data.message);
        this.page.querySelector(".thank-you").classList.remove("d-none");
        this.page.querySelector("#signup-form").classList.add("d-none");
      })
      .catch((err) => {
        if (Array.isArray(err)) {
          err.map((input) => {
            this.page.querySelector(`#${input.id}`).classList.add("invalid");
          });
          return;
        }
        toast(err.message);
        console.error(err);
      });
  };
}
