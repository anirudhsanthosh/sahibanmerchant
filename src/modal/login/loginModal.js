import { SITE, API_URL, LOGIN_NODE } from "../../config";

export default async function loginModal(username, password) {
  let url = SITE + API_URL + LOGIN_NODE;

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
