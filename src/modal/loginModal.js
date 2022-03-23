import { SITE, API_URL, LOGIN_NODE } from "../config";

export default async function loginModal(username, password) {
  let url = SITE + API_URL + LOGIN_NODE;
  //   url = "http://localhost/wordpress//wp-json/wp/v2/users/me";
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
