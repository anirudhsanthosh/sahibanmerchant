export default class jsonHandler {
  static parse(str) {
    try {
      let result = JSON.parse(str);
      return result;
    } catch (e) {
      return false;
    }
  }

  static stringify(obj) {
    try {
      let result = JSON.stringify(obj);
      return result;
    } catch (e) {
      return false;
    }
  }
}
