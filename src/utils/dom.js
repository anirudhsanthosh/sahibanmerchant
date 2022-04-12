/**
 *
 * @param {String} element Html element name
 * @param {Array} classNames list of class names
 * @returns HTML element
 */
export function createElement(
  element = "div",
  classNames = [],
  attributs = {}
) {
  const newElem = document.createElement(element);
  classNames.map((className) => newElem.classList.add(className));
  for (const [key, value] of Object.entries(attributs)) {
    newElem.setAttribute(key, value);
  }
  return newElem;
}
export function createOnsElement(
  element = "div",
  classNames = [],
  attributs = {}
) {
  const newElem = ons.createElement(element);
  classNames.map((className) => newElem.classList.add(className));
  for (const [key, value] of Object.entries(attributs)) {
    newElem.setAttribute(key, value);
  }
  return newElem;
}

export function removeElement(element) {
  element.remove();
}

export function createTextNode(text) {
  return document.createTextNode(text);
}
