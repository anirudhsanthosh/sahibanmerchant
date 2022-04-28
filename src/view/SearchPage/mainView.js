import { SEARCH_PAGE_INPUT_ID } from "../../config";
import ajaxResultDisplay from "./ajaxResultView";
import {
  clearButtonVisibility,
  buttonOnclick as clearButtonOnClick,
} from "./clearButton";
/**
 *
 * @param {Function} searchFunction  function for send search query while submiting
 * @param {Array <String>} history list of search history
 * @param {Function} removeFromHistory function for remove query term from history
 */
export default function SearchpageMainView(
  searchFunction,
  history,
  removeFromHistory
) {
  // adding event listners
  addAllEventListners(searchFunction);

  //passing onclick function to clear button
  clearButtonOnClick(clearSearchField);

  // showing all history in search page
  displayAjaxview(history, searchFunction);
}

export function displayAjaxview(history, searchFunction) {
  //adding search history to display
  ajaxResultDisplay(
    history,
    (selectedHistory) =>
      selectHistoryFromDisplay(selectedHistory, searchFunction),
    (selectedHistory) => chooseHistoryForEditing(selectedHistory)
  );
}
/**
 *
 * @param {String} history the history user selected from ajax display on search page
 *
 */
function selectHistoryFromDisplay(history, searchFunction) {
  let input = document.getElementById(SEARCH_PAGE_INPUT_ID);
  input.value = history;
  focusInputElement();
  searchFunction(history);
}

function chooseHistoryForEditing(selectedHistory) {
  let input = document.getElementById(SEARCH_PAGE_INPUT_ID);
  focusInputElement();

  input.value = selectedHistory;
}

function focusInputElement() {
  document.getElementById(SEARCH_PAGE_INPUT_ID).focus();
}

function clearSearchField() {
  let input = document.getElementById(SEARCH_PAGE_INPUT_ID);
  input.value = "";
  clearButtonVisibility(!emptySearch(input.value));
}

function emptySearch(value) {
  if (value === "" || !value || value.length == 0) return true;
  return false;
}

function addAllEventListners(searchFunction) {
  let input = document.getElementById(SEARCH_PAGE_INPUT_ID);

  // adding eventlistner for key press looking for enetr key
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchFunction(e.target.value);
  });

  // adding event lister for chage and input evet for adding and removing cler key

  input.addEventListener("input", (e) => {
    clearButtonVisibility(!emptySearch(e.target.value));
  });

  input.addEventListener("change", (e) => {
    clearButtonVisibility(!emptySearch(e.target.value));
  });
}
