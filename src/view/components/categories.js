//  import browser from "./includes/inAppBrowser.js";
export {
  mockGrid,
  cratecategoryGrid,
  indexedCatagories,
  skeltonIndexedCategories,
};

const materialColors = [
  "#D32F2F",
  "#C2185B",
  "#880E4F",
  "#4A148C",
  "#D500F9",
  "#3949AB",
  "#1976D2",
  "#1565C0",
  "#0D47A1",
];
function htmlDecode(input) {
  var e = document.createElement("textarea");
  e.innerHTML = input;
  // handle case of empty input
  return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

class skeltonIndexedCategories {
  constructor(displayElement) {
    displayElement = document.getElementById(displayElement);
    displayElement.innerHTML = "";
    let list = document.createElement("ons-list");
    list.classList.add("skelton-list");

    displayElement.appendChild(list);
    for (let i = 0; i <= 5; i++) {
      let listItem = document.createElement("ons-list-item");
      let name = document.createElement("div");
      name.classList.add("center");
      name.innerHTML = `<div class="skelton-loader skelton-name"></div>`;
      listItem.appendChild(name);

      // let src = element.image? element.image.src : "img/placeholder.svg";
      let image = document.createElement("div");
      image.classList.add("left");

      image.innerHTML = `<div class="list-item__thumbnail skelton-loader skelton-image" ></div>`;
      listItem.appendChild(image);
      list.appendChild(listItem);
    }
  }
}

class indexedCatagories {
  constructor(displayElement, data) {
    displayElement.innerHTML = "";
    let list = document.createElement("ons-list");
    displayElement.appendChild(list);

    // map through elements
    data[0].map((element) => {
      let listItem = document.createElement("ons-list-item");
      listItem.classList.add("catagoryList-main-item");

      let name = document.createElement("div");
      name.classList.add("center", "category-list-name");
      name.innerText = htmlDecode(element.name);
      listItem.appendChild(name);

      let src = element.image ? element.image.src : "img/placeholder.svg";
      let image = document.createElement("div");
      image.classList.add("left");

      image.innerHTML = `<img class="list-item__thumbnail category-list-image" src="${src}">`;
      listItem.appendChild(image);

      if (data[element.id]) {
        listItem.setAttribute("expandable");
        let customIcon = document.createElement("div");
        customIcon.classList.add("right", "aa");
        customIcon.innerText = "...";
        listItem.appendChild(customIcon);
      } else
        listItem.onclick = () => {
          console.log("todo", htmlDecode(element.name), element.permalink);
          window.activeBrowser?.hide();
          window.activeBrowser = null;
          window.activeBrowser = new browser(element.permalink);
        };

      if (data[element.id]) {
        let nestedList = this.#createNestedTree(data, element.id);
        listItem.appendChild(nestedList);
      }

      list.appendChild(listItem);
      // listItem.setAttribute("expandable");
    });
  }

  #createNestedTree(data, index) {
    console.log(data[index]);
    let div = document.createElement("div");
    div.classList.add("expandable-content");
    let list = document.createElement("ons-list");
    div.appendChild(list);

    data[index].forEach((element) => {
      let listItem = document.createElement("ons-list-item");

      let name = document.createElement("div");
      name.classList.add("center", "category-list-name");
      name.innerText = htmlDecode(element.name);
      listItem.appendChild(name);

      let src = element.image ? element.image.src : "img/placeholder.svg";
      let image = document.createElement("div");
      image.classList.add("left");

      image.innerHTML = `<img class="list-item__thumbnail category-list-image" src="${src}">`;
      listItem.appendChild(image);

      if (data[element.id]) {
        listItem.setAttribute("expandable");
        let customIcon = document.createElement("div");
        customIcon.classList.add("right", "aa");
        customIcon.innerText = "...";
        listItem.appendChild(customIcon);
      } else
        listItem.onclick = () => {
          console.log("todo", htmlDecode(element.name), element.permalink);
          window.activeBrowser?.hide();
          window.activeBrowser = null;
          window.activeBrowser = new browser(element.permalink);
        };

      if (data[element.id]) {
        let nestedList = this.#createNestedTree(data, element.id);
        listItem.appendChild(nestedList);
      }
      list.appendChild(listItem);
    });

    return div;
  }
}

export default class cratecategoryGrid {
  element;
  list;
  categoryTiles;
  defaultImg = "img/main_icon.svg";
  container;
  constructor(element, data) {
    this.element = element;
    this.list = data;
    let container = document.createElement("div");
    container.classList.add("categoryGrid");
    this.container = container;

    this.categoryTiles = this.list.map((category) => {
      let ancher = document.createElement("a");
      // ancher.href = category.permalink;

      ///// opening a new inapp browser and direct user to that
      ancher.onclick = () => {
        window.activeBrowser?.close?.(); // checking inapp browser instance exit or not if exixt close it first
        window.activeBrowser = new browser(category.permalink);
      };

      let cell = document.createElement("div");
      ancher.appendChild(cell);

      cell.classList.add("categoryCell");
      let card = document.createElement("div");
      card.classList.add("categoryCard");
      cell.appendChild(card);
      let imageContainer = document.createElement("div");
      imageContainer.classList.add("categoryImageContainer");
      card.appendChild(imageContainer);
      let img;

      if (category.image) {
        let src = category.image.src;
        img = document.createElement("img");
        img.src = src;
      } else {
        img = document.createElement("div");
        img.classList.add("img", "imgAlt");
        img.innerHTML = category.name.substring(0, 2);
        img.style.background =
          materialColors[
            Math.round(Math.random() * (materialColors.length - 1))
          ];
      }
      img.classList.add("categoryGridImage");

      imageContainer.appendChild(img);

      let cardText = document.createElement("div");

      cardText.classList.add("categoryHero");
      card.appendChild(cardText);
      cardText.textContent = htmlDecode(category.name);

      container.appendChild(ancher);
    });

    this.element.innerHTML = "";
    this.element.appendChild(this.container);
  }
}

class mockGrid {
  #gridCount = 9;
  #categoryTiles;
  #element;
  #container;
  constructor(element) {
    this.#element = element;
    let container = document.createElement("div");
    this.#container = container;
    container.classList.add("categoryGrid");
    // this.categoryTiles
    for (let i = 0; i < this.#gridCount; i++) {
      let ancher = document.createElement("div");
      ancher.classList.add("a");

      let cell = document.createElement("div");
      ancher.appendChild(cell);

      cell.classList.add("categoryCell");
      let card = document.createElement("div");
      card.classList.add("categoryCard");
      cell.appendChild(card);
      let img = document.createElement("div");
      img.classList.add("img", "skelton-loader");

      card.appendChild(img);

      let cardText = document.createElement("div");

      cardText.classList.add("categoryHero-skelton");
      card.appendChild(cardText);

      let cardTextSpan = document.createElement("span");
      cardTextSpan.classList.add("categoryHero-skelton-span", "skelton-loader");
      cardText.appendChild(cardTextSpan);

      container.appendChild(ancher);
    }

    this.#element.innerHTML = "";
    this.#element.appendChild(this.#container);
  }
}
