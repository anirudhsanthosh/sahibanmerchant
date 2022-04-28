import { SEARCH_PAGE_AJAX_RESULT_DISPLAY_ID } from "../../config";
import { createElement } from "../../utils/dom";
/**
 *
 * @param {Array<String>} results list of items for display
 *
 * @param {Function} select this function get invoked when user want to select for searching the item from list
 * @param {Function}  SelectForEditing this function get invoked when user select this item from list for editing
 */
export default function ajaxResultDisplay(
  results = [],
  select = () => {},
  SelectForEditing = () => {}
) {
  document.getElementById(SEARCH_PAGE_AJAX_RESULT_DISPLAY_ID).innerHTML = "";
  results.map((result) => {
    document
      .getElementById(SEARCH_PAGE_AJAX_RESULT_DISPLAY_ID)
      .append(
        createChip({ name: result, onSelect: select, edit: SelectForEditing })
      );
  });
}

function createChip(item) {
  const chip = createElement("div", ["search-item-chip"]);

  const label = createElement();
  label.onclick = () => item.onSelect(item.name);
  label.classList.add("label");
  label.innerText = item.name;
  const choose = createElement("div", ["choose"]);
  choose.onclick = () => item.edit(item.name);
  const icon = createElement("ons-icon");
  icon.setAttribute("icon", "md-arrow-right-top");
  choose.append(icon);
  chip.append(label, choose);
  return chip;
}
