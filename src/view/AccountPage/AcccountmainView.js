import { ACCOUNT_PAGE_DISPLAY_ROOT_ID } from "../../config";
import { createElement } from "../../utils/dom";
export default function accountMainView(props) {
  const root = document.querySelector(`#${ACCOUNT_PAGE_DISPLAY_ROOT_ID}`);
  if (!root) return false;
  const { displayName, email, firstName, lastName, phone } = props;

  //account settings loader

  const loader = root.querySelector(".cart-item-loader");
  loader.show = () => loader.classList.add("show");
  loader.hide = () => loader.classList.remove("show");

  //logout button
  const logoutButton = document.querySelector("#logout-button");
  logoutButton.onclick = props.logout;

  //save button
  const saveButton = document.querySelector("#save-account-details");
  saveButton.onclick = () => {
    loader.show();
    const data = getDataFromFields();
    props
      .updateUser(data)
      .then((res) => {
        editMode(false);
        clearMessage();
        loader.hide();
        console.log({ res });
      })
      .catch((e) => {
        clearMessage();
        renderMessage(e);
        loader.hide();
        console.log(e);
      });
  };
  // edit cancel button
  const cancelButton = root.querySelector("#cancel-account-details-edit");
  cancelButton.onclick = () => editMode(false);
  //edit button
  const editButton = document.querySelector("#edit-account-details");
  editButton.onclick = onEditButtonClick;

  //ordersButton onclick
  const ordersButton = document.querySelector("#orders-button");
  ordersButton.onclick = props.ordersButtonOnClick;

  // render user displayname
  renderDisplayName(displayName);
  renderFirstName(firstName);
  renderLastname(lastName);
  renderEmail(email);
  renderDisplayNameInInput(displayName);
  renderPhone(phone);

  function renderDisplayName(name) {
    root.querySelector(".display-name").textContent = name;
  }
  function renderFirstName(name) {
    root.querySelector("#firstname").value = name;
  }
  function renderLastname(name) {
    root.querySelector("#lastname").value = name;
  }
  function renderEmail(name) {
    root.querySelector("#email").value = name;
  }
  function renderDisplayNameInInput(name) {
    root.querySelector("#displayname").value = name;
  }
  function renderPhone(name) {
    root.querySelector("#phone").value = name;
  }

  function onEditButtonClick() {
    editMode(true);
  }

  function editMode(enable) {
    document
      .querySelectorAll(".account-form .form-control input")
      .forEach((input) => {
        input.disabled = !enable;
      });
    if (enable) {
      editButton.classList.add("d-none");
      saveButton.classList.remove("d-none");
    } else {
      editButton.classList.remove("d-none");
      saveButton.classList.add("d-none");
    }
  }

  function getDataFromFields() {
    const data = {};
    data.firstName = root.querySelector("#firstname").value;
    data.lastName = root.querySelector("#lastname").value;
    data.email = root.querySelector("#email").value;
    data.displayName = root.querySelector("#displayname").value;
    data.phone = root.querySelector("#phone").value;
    return data;
  }

  function renderMessage(message) {
    const container = root.querySelector(".notification-container");
    const li = createElement("li", ["notification-item"]);
    li.append(message);
    container.append(li);
  }

  function clearMessage() {
    root.querySelector(".notification-container").innerHTML = "";
  }
}
