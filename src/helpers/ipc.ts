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

export function publishMessage(channel:string,...args:any[]) {
  if (isRenderer) {
    ipcRenderer.send(channel, ...args);
  } else {
    BrowserWindow.getAllWindows().forEach(win => {
      win.webContents.send(channel, ...args);
    });
  }
}

export function subscribeMessage(channel: string, listener: IpcEventListener) {
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

type StateChangeListener = (newState: Object) => void;

let currentState: Object;
const listeners = new Set<StateChangeListener>();
const stateChannel = "update_shared_state";

function refreshState(newState:Object) {
  if (currentState === newState) {
    return false;
  }
  Object.freeze(newState);
  currentState = newState;
  listeners.forEach(listener => listener(currentState));
  return true;
}

subscribeMessage(stateChannel, (event, newState) => refreshState(newState));

export function updateState(newState: Object) {
  if (refreshState(newState)) {
    publishMessage(stateChannel, currentState);
  }
}

export function subscribeState(listener: StateChangeListener) {
  listeners.add(listener);
  listener(currentState);
  return {
    Dispose() { listeners.delete(listener); }
  };
}

interface IpcSender {
  send(channel: string, ...args: any[]): void;
}

interface IpcEvent {
  sender: IpcSender;
}

type IpcEventListener = (event: IpcEvent, ...args: any[]) => void;
