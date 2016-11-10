import { ipcRenderer } from "electron";
declare const Notification: any;

export function setupNotifications() {
  ipcRenderer.on("notification", (event, arg) => new Notification(arg.title, { body: arg.body }));
}

function sendOnlineStatus() {
  navigator.onLine ? ipcRenderer.send("online") : ipcRenderer.send("offline");
}

export function setupOnlineStatus() {
  ipcRenderer.on("online-status", (event, arg) => sendOnlineStatus());
  sendOnlineStatus();
  window.addEventListener("online", () => ipcRenderer.send("online"));
  window.addEventListener("offline", () => ipcRenderer.send("offline"));
}