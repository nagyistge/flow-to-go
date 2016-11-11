import { BrowserWindow, ipcRenderer, ipcMain } from "electron";

const isRenderer = (function () {
  // running in a web browser
  if (typeof process === 'undefined') {
    return true;
  }

  // node-integration is disabled
  if (!process) {
    return true;
  }
  // We're in node.js somehow
  if (!process.type) {
    return false;
  }
  return process.type === 'renderer';
})();

export function publish(channel:string,...args:any[]) {
  if (isRenderer) {
    ipcRenderer.send(channel, ...args);
  } else {
    BrowserWindow.getAllWindows().forEach(win => {
      win.webContents.send(channel, ...args);
    });
  }
}

export function subscribe(channel: string, listener: IpcEventListener) {
  if (isRenderer) {
    ipcRenderer.on(channel, listener);
    return {
      Dispose() {
        ipcRenderer.removeListener(channel, listener);
      }
    };
  } else {
    ipcMain.on(channel, listener);
    return {
      Dispose() {
        ipcMain.removeListener(channel, listener);
      }
    };
  }
}

interface IpcSender {
  send(channel: string, ...args: any[]): void;
}

interface IpcEvent {
  sender: IpcSender;
}

type IpcEventListener = (event: IpcEvent, ...args: any[]) => void;
