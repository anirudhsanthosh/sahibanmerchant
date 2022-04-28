import { createElement } from "../../utils/dom";
export default function (config = {}) {
  const button = createElement("button", ["button", "round-button"]);
  if (config.text) button.innerHTML = config.text;
  if (config.icon)
    button.append(createElement("ons-icon", [], { icon: config.icon }));
  if (config.onclick) button.onclick = config.onclick;
  return button;
}
