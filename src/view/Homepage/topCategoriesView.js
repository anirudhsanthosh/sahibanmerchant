import roundChip from "../components/chip";

export default class topCategoriesView {
  constructor(config) {
    this.config = config;
    this.topCategories = this.config.topCategories;
    this.topCategoriesContainer = document.getElementById(
      this.config.topCategoriesContainer
    );
    this.topCategoriesContainer.innerHTML = "";
    this.topCategoriesContainer.classList.add(
      "topCategoriesContainer",
      "flex-slider"
    );

    this.topCategories.forEach((category) => {
      const config = {
        text: category.name,
        onClick: category.onClick,
      };
      const chipElem = roundChip(config);
      this.topCategoriesContainer.appendChild(chipElem);
    });
  }
}
