export function toast(message = "", timeout = 2000) {
  if (!message) return;
  ons.notification.toast(message, {
    timeout,
  });
}
