import { mockFlexSlider } from "./components/slider";
import { mockGrid } from "./components/categories";
export default function mainSkeltonView(event) {
  let flexSliderElement = "offerSlider-flex";
  // building skelton loader
  new mockFlexSlider(flexSliderElement);
  // category skelton
  let categoryShowcase = document.getElementById("catagoriesShowcase");
  new mockGrid(categoryShowcase);
}
