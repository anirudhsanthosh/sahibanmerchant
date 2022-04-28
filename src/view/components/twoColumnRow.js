import { createElement, createOnsElement } from "../../utils/dom";

export default function createRow({
  left = { classNames: [], text: "" },
  right = { classNames: [], text: "" },
}) {
  const row = createElement("div", ["row"]);
  left.text = left?.text ?? "";
  right.text = right?.text ?? "";
  left.classNames = left?.classNames ?? [];
  right.classNames = right?.classNames ?? [];
  const leftColumn = createElement("div", ["column", ...left?.classNames]);
  leftColumn.append(left.text);
  const rightColumn = createElement("div", ["column", ...right?.classNames]);
  rightColumn.append(right.text);
  row.append(leftColumn, rightColumn);
  return row;
}
