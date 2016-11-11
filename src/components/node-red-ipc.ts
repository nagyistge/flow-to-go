import * as MessageBus from "../helpers/message_bus";

declare const Notification: any;

export function setupNotifications() {
  MessageBus.subscribe("notification", (event, arg) => new Notification(arg.title, { body: arg.body }));
}

function sendOnlineStatus() {
  navigator.onLine ? MessageBus.publish("online") : MessageBus.publish("offline");
}

export function setupOnlineStatus() {
  MessageBus.subscribe("online-status", (event, arg) => sendOnlineStatus());
  sendOnlineStatus();
  window.addEventListener("online", () => MessageBus.publish("online"));
  window.addEventListener("offline", () => MessageBus.publish("offline"));
}