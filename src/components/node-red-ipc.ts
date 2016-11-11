import * as MessageBus from "../helpers/message_bus";

declare const Notification: any;

export function setupNotifications() {
  MessageBus.subscribe("notification", (event, arg) => new Notification(arg.title, { body: arg.body }));
}

export function setupOnlineStatus() {
  MessageBus.subscribe("online-status", (event, arg) => event.sender.send(navigator.onLine ? "online" : "offline"));
  navigator.onLine ? MessageBus.publish("online") : MessageBus.publish("offline");
  window.addEventListener("online", () => MessageBus.publish("online"));
  window.addEventListener("offline", () => MessageBus.publish("offline"));
}