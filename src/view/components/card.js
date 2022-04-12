import { createElement, createTextNode } from "../../utils/dom";
//generic card creator , card outer eleent is section
/**
 *
 * @param {*} config
 * takes title,body,
 */
export default function (config = {}) {
  const { title, body } = config;

  const card = createElement("section");
  const cardInnerWrapper = createElement("div", ["section-container"]);
  card.appendChild(cardInnerWrapper);

  const titleClasses = title.classNames ?? [];
  const cardTitle = createElement("h5", ["card-title", ...titleClasses]);

  cardTitle.appendChild(createTextNode(title.content));

  let cardBody;
  if (Array.isArray(body)) {
    cardBody = body.map((body) => {
      return createCardBody(body);
    });
    cardInnerWrapper.append(cardTitle, ...cardBody);
  } else {
    cardBody = createCardBody(body);
    cardInnerWrapper.append(cardTitle, cardBody);
  }

  return card;
}

function createCardBody(body = {}) {
  const bodyClasses = body.classNames ?? [];
  const cardBody = createElement("div", ["card-body", ...bodyClasses]);
  const [leftShadow, rightShadow] = createShadowElements();
  cardBody.append(leftShadow, ...body.content, rightShadow);

  // attaching scroll event with card body
  // attachScrollEventForShadows({ cardBody, leftShadow, rightShadow });

  // change opacity of shadow elements at the time of mounting
  // validateScrllShadows({ cardBody, leftShadow, rightShadow });
  return cardBody;
}

function createShadowElements() {
  const leftShadow = createElement("div", [
    "scroll-shadow-left",
    "scroll-shadow",
  ]);
  const rightShadow = createElement("div", [
    "scroll-shadow-right",
    "scroll-shadow",
  ]);
  return [leftShadow, rightShadow];
}

// this event will monitor how far the emenet is scrolled horizontaly
function attachScrollEventForShadows({ cardBody, leftShadow, rightShadow }) {
  cardBody.addEventListener("scroll", (e) => {
    const cardBodyWidth = cardBody.getBoundingClientRect().width;
    // const cardBodyOffsetLeft = cardBody.offsetLeft;
    const cardScrollWidth = cardBody.scrollWidth;

    const scrolled = e.target.scrollLeft / (cardScrollWidth - cardBodyWidth);
    leftShadow.style.opacity = scrolled;
    rightShadow.style.opacity = 1 - scrolled;
  });
}

function validateScrllShadows({ cardBody, leftShadow, rightShadow }) {
  // create a mutation observer and watch the element is atached to dom or not
  let observer;
  const mutationCallback = (mutations) => {
    console.log("mutations");
    mutations.forEach(function (mutation) {
      for (var i = 0; i < mutation.addedNodes.length; i++) {
        console.log(mutation.addedNodes[i]);
        if (document.body.contains(cardBody)) {
          console.log("contain");
          observer.disconnect();
          const cardBodyWidth = cardBody.getBoundingClientRect().width;
          const cardScrollWidth = cardBody.scrollWidth;
          if (cardBodyWidth / cardScrollWidth < 1) {
            leftShadow.style.opacity = 0;
            rightShadow.style.opacity = 1;
          }
        }
      }
    });
  };
  observer = new MutationObserver(mutationCallback);
  observer.observe(document, {
    childList: true,
    subtree: true,
  });
}
