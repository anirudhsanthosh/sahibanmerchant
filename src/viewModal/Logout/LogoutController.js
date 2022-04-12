import userModal from "../../modal/user/userModal";
import NavigationController from "../Navigation/navigationController";

export default function LogoutController() {
  userModal.setAuth({});
  userModal.set({});
  NavigationController.resetToLogin();
}
