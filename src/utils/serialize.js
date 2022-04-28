export function toQueryString(obj) {
  var str = [];

  for (const [key, value] of Object.entries(obj)) {
    str.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
  }
  return str.join("&");
}
