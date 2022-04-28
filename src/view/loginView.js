/**
 *
 * @param {Function} onLoginButtonClick the function which handles login button
 * @returns {Function} alert a function for  displays error while login.
 */
export default function LoginView(
  onLoginButtonClick,
  onSignupButtonClick,
  onForgotPasswordButtonClick
) {
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const loginButton = document.getElementById("loginButton");
  const signupButton = document.getElementById("goTocreateAccountpage");
  const forgotPasswordButton = document.getElementById(
    "gotoForgotPasswordPage"
  );

  loginButton.onclick = () => {
    const username = usernameInput.value;
    const password = passwordInput.value;
    onLoginButtonClick(username, password);
  };
  signupButton.onclick = () => {
    onSignupButtonClick();
  };
  forgotPasswordButton.onclick = () => {
    onForgotPasswordButtonClick();
  };

  return alert;
}
/**
 *
 * @param {String} message alert which to show when error occured while login
 * @param {String} color color which the message will be shown
 */
export function alert(message, color = "#f00") {
  const messageNode = document.getElementById("loginMessage");
  messageNode.innerText = "";
  messageNode.innerText = message;
  messageNode.style.color = color;
}
