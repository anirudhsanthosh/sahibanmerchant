// import browser from "./inAppBrowser.js";

export default class bottomNavigator {
  #element = document.getElementById("bottomNav-container");
  #buttons;

  constructor(buttons) {
    this.#buttons = buttons;
    this.#buttons.map((button) => this.#createButton(button));
  }

  #createButton(data) {
    let button = document.createElement("div");
    if (data.active) button.classList.add("active");
    button.classList.add("bottomNav-btn");

    let icon = document.createElement("ons-icon");
    icon.setAttribute("icon", data.icon);

    let text = document.createElement("span");
    text.textContent = data.name;

    button.append(icon, text);

    if (data.badge) {
      let badge = document.createElement("span");
      badge.id = data.badgeId;
      badge.classList.add(data.badgeId);
      badge.innerHTML = 0;
      button.append(badge);
    }

    button.onclick = () => {
      data.onclick();
    };

    document.addEventListener("postpush", (event) => {
      if (event.enterPage.id !== data.id) return;
      if (data.indication) {
        Array.from(this.#element.children).map((button) =>
          button.classList.remove("active")
        );
        button.classList.add("active");
      }
      data?.postpush?.();
    });

    document.addEventListener("postpop", (event) => {
      console.log(event);
      if (event.navigator.topPage.id == data.id) {
        if (data.indication) {
          Array.from(this.#element.children).map((button) =>
            button.classList.remove("active")
          );
          button.classList.add("active");
        }
      }
    });

    this.#element.appendChild(button);
  }

  show() {
    this.#element.parentElement.style.display = "";
  }

  hide() {
    this.#element.parentElement.style.display = "none";
  }
}
