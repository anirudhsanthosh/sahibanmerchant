import { getAuthHeader } from "./userModal";

export default function appMetadata() {
  const auth = getAuthHeader();
}
