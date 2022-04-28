import { mockFlexSlider } from "./components/slider";
export default function mainSkeltonView(event) {
  let flexSliderElement = "offerSlider-flex";
  // building skelton loader
  new mockFlexSlider(flexSliderElement);
  // category skelton
  let categoryShowcase = document.getElementById("catagoriesShowcase");
  if (categoryShowcase) categoryShowcase.parentElement.remove();
  // new mockGrid(categoryShowcase);
}
