import { trim, isEmpty } from "validator";

export function isPassBasicValidation(str) {
  let input = str.trim();
  if (isEmpty(input)) return false;
  else return input;
}

export function isEmptyObject(obj) {
  if (!obj.constructor === Object) return true;
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

export function isAndroid() {
  return cordova.platformId === "android";
}
