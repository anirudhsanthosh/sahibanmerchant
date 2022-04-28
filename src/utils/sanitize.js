export function formatNumber(number) {
  if (number === null || number === undefined) return "";
  return Number(number).toLocaleString();
}

export function decodeHtml(html) {
  var txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

export function calculateDiscount(saleprice, regularprice) {
  return Math.floor((1 - saleprice / regularprice) * 100) ?? null;
}
