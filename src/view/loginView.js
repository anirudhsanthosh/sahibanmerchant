export default function LoginView(onLoginButtonClick) {
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const loginButton = document.getElementById("loginButton");

  loginButton.onclick = () => {
    const username = usernameInput.value;
    const password = passwordInput.value;
    onLoginButtonClick(username, password);
  };

  return alert;
}

export function alert(message, color = "#000") {
  const messageNode = document.getElementById("loginMessage");
  messageNode.innerText = "";
  messageNode.innerText = message;
  messageNode.style.color = color;
}
