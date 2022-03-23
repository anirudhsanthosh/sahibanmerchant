export default function loginView(onLoginButtonClick) {
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const loginButton = document.getElementById("loginButton");
  const messageNode = document.getElementById("loginMessage");

  loginButton.onclick = () => {
    const username = usernameInput.value;
    const password = passwordInput.value;
    onLoginButtonClick(username, password);
  };

  function alert(message, color = "#000") {
    messageNode.innerText = "";
    messageNode.innerText = message;
    messageNode.style.color = color;
  }
  return alert;
}
