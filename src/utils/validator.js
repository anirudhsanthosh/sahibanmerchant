import { trim, isEmpty } from "validator";

export function isPassBasicValidation(str) {
  let input = str.trim();
  if (isEmpty(input)) return false;
  else return input;
}
