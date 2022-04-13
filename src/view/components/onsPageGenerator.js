import { createElement } from "../../utils/dom";

// generates ons-page inside of a template element
export default function onsPageGenerator(
  config = { classNames: ["product-display-page-from-template"] }
) {
  if (config.constructor.name !== "Object") {
    throw new Error("config must be an object");
  }
  const id = config.id ?? Math.random().toString(36).substring(2, 15) + ".html";
  const template = ons.createElement(
    `<template id="${id}"><ons-page id="page-${id}" class="${config.classNames.join(
      " "
    )}"><ons-toolbar modifier="material" class="product-page-toolbar"><div class="left">
    <ons-back-button>Back</ons-back-button>
  </div></ons-toolbar></ons-page></template>`
  );
  return { page: template, id };
}
