import { SEARCH_PAGE_CLEAR_BUTTON_ID } from "../../config";

export function clearButtonVisibility(visible) {
  const clearButton = document.getElementById(SEARCH_PAGE_CLEAR_BUTTON_ID);
  if (!visible) return clearButton.classList.remove("active");
  clearButton.classList.add("active");
}
export function buttonOnclick(onClickunction) {
  const clearButton = document.getElementById(SEARCH_PAGE_CLEAR_BUTTON_ID);
  clearButton.addEventListener("click", (e) => onClickunction(e));
}
