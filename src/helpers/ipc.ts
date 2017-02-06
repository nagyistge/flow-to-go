const { webContents, ipcRenderer, ipcMain, remote } = require('electron');

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
      // console.log('publishMessage renderer '+JSON.stringify(args));
      ipcRenderer.send(channel, ...args);
    } else {
      // console.log('publishMessage main '+JSON.stringify(args));
      webContents.getAllWebContents().forEach(item => {
      item.send(channel, ...args);
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

export function unsubscribeMessage(channel: string, listener: IpcEventListener) {
  if (isRenderer) {
    ipcRenderer.removeListener(channel, listener);
  } else {
    ipcMain.removeListener(channel, listener);
  };
}

const stateChannel = 'update_shared_state';
let currentState: any = isRenderer ? remote.getGlobal(stateChannel) : undefined;
const listeners = new Set<StateChangeListener<any>>();

function refreshState<T>(newState:T):boolean {
  if (currentState === newState) {
    return false;
  }
  Object.freeze(newState);
  currentState = newState;
  if (!isRenderer) {
    (<any>global)[stateChannel] = currentState;
  }
  // console.log('refreshState ' + JSON.stringify(newState));
  listeners.forEach(listener => listener(currentState));
  return true;
}

subscribeMessage(stateChannel, (event, newState) => {
    refreshState(newState);
});

export function setState<T>(newState: T) {
  if (refreshState<T>(newState)) {
    // console.log('setState '+JSON.stringify(newState));
    publishMessage(stateChannel, currentState);
  }
}

export function updateState<T>(stateUpdate:T) {
  const newState = Object.assign({}, currentState, stateUpdate);
  // console.log('updateState '+JSON.stringify(newState));
  setState<T>(newState);
}

export async function getState<T>(filter?: (state: T) => boolean): Promise<T> {
  let subscription: { Dispose: () => void };
  try {
    return await new Promise<T>((resolve, reject) => {
        subscription = subscribeState<T>(state => {
        const isMatch = filter && filter(state) || !filter;
        if (isMatch)  {
          resolve(state);
        }
      });
    });
  } finally {
    subscription.Dispose();
  }
}

export function subscribeState<T>(listener: StateChangeListener<T>) {
  listeners.add(listener);
  listener(currentState);
  return {
    Dispose() { listeners.delete(listener); }
  };
}

export function unsubscribeState<T>(listener: StateChangeListener<T>) {
  return listeners.delete(listener);
}

type StateChangeListener<T> = (newState: T) => void;

interface IpcSender {
  send(channel: string, ...args: any[]): void;
}

interface IpcEvent {
  sender: IpcSender;
}

type IpcEventListener = (event: IpcEvent, ...args: any[]) => void;