import searchModal from "../../modal/search/searchModal";
import { SEARCH_HISTORY_MAX_LENGTH } from "../../config";
import SeachPageMainView, {
  displayAjaxview,
} from "../../view/SearchPage/mainView";

import ProductsController from "../Products/ProductsController";

export default function searchController() {
  let searchHistory = searchModal.get();
  //launching search page list
  SeachPageMainView(search, searchHistory.reverse(), removeFromHistory);
}

function search(query) {
  if (!query || query.length == 0) return;

  // creating new history array
  let newHistory = reArrangeSearchHistory(query, searchModal.get());
  //reducing array size to max history length (SEARCH_HISTORY_MAX_LENGTH)
  newHistory = newHistory.slice(
    newHistory.length - SEARCH_HISTORY_MAX_LENGTH,
    newHistory.length
  );
  // saving new history
  searchModal.set(newHistory);

  const config = {
    query: {
      search: query,
      title: query,
    },
  };
  new ProductsController(config);

  console.log("searched for", query);
  displayAjaxview(newHistory.reverse(), search);
}

function reArrangeSearchHistory(newQuery, history = []) {
  if (history.indexOf(newQuery) == -1) {
    history.push(newQuery);
    return history;
  }

  let newHistory = removeFromQuery(newQuery, history);
  newHistory.push(newQuery);
  return newHistory;
}

function removeFromQuery(query, history) {
  return history.filter((term) => term !== query);
}

function removeFromHistory(query) {
  let newHistory = removeFromQuery(query, searchModal.get());
  // saving new history
  searchModal.set(newHistory);
}
