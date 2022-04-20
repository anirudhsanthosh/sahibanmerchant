import { SITE, API_URL, LOGIN_NODE } from "../../config";
import { isAndroid } from "../../utils/validator";

export default async function loginModal(username, password) {
  let url = SITE + API_URL + LOGIN_NODE;

  // if (!isAndroid()) {
  //   cordova.plugin.http.useBasicAuth(username, password);
  //   cordova.plugin.http.setDataSerializer("json");
  //   return new Promise((resolve, reject) => {
  //     cordova.plugin.http.post(
  //       url,
  //       {},
  //       {},
  //       (success) => {
  //         console.log(success);
  //       },
  //       (failure) => {
  //         console.log(failure);
  //       }
  //     );
  //   });
  // }

  const payload = {};
  const config = {
    headers: { Authorization: "Basic " + btoa(`${username}:${password}`) },
  };

  try {
    const data = await axios.post(url, payload, config);
    return data;
  } catch (e) {
    return { error: e };
  }
}
