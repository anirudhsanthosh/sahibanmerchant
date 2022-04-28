import { PAGES } from "../../config";
import { toast } from "../../utils/notification";

export default class ForgotPasswordView {
  constructor(props) {
    this.init(props);
  }

  init(props) {
    window.activeNavigator.push(PAGES.forgotPassword).then((page) => {
      page.querySelector("#backtologinButton").onclick =
        props.onBackToLoginButtonClick;

      page.querySelector("#forgot-password-submit-button").onclick = () =>
        this.onForgotPasswordButtonClick(props, page);
    });
  }

  onForgotPasswordButtonClick(props, page) {
    const form = page.querySelector("#forgot-password-form");
    const inputs = [...form.querySelectorAll("ons-input")].map((input) => {
      input.classList.remove("invalid");
      return {
        id: input.id,
        value: input.value,
      };
    });

    props
      .onForgotPasswordButtonClick(inputs)
      .then((res) => {
        if (res.error) throw new Error(res.error.response.data.message);
        page
          .querySelector(".forgot-password-thank-you")
          .classList.remove("d-none");
        page.querySelector("#forgot-password-form").classList.add("d-none");
      })
      .catch((err) => {
        if (Array.isArray(err)) {
          err.map((input) => {
            page.querySelector(`#${input.id}`).classList.add("invalid");
          });
          return;
        }
        toast(err.message);
        console.error(err);
      });
  }
}
