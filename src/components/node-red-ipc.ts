import * as ipc from '../helpers/ipc';

declare const Notification: any;

export function setupNotifications() {
  ipc.subscribeMessage('notification', (event, arg) => new Notification(arg.title, { body: arg.body }));
}

export function setupOnlineStatus() {
  ipc.subscribeMessage('online-status', (event, arg) => event.sender.send(navigator.onLine ? 'online' : 'offline'));
  navigator.onLine ? ipc.publishMessage('online') : ipc.publishMessage('offline');
  window.addEventListener('online', () => ipc.publishMessage('online'));
  window.addEventListener('offline', () => ipc.publishMessage('offline'));
}