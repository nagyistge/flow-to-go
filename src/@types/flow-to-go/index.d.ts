
interface globalState {
  nodeRedUrl: string;
  nodeRedAdmin: string;
  currentView: string;
  menuOpen: boolean;
  menuItems: MenuItem[];
}

interface MenuItem {
  id: string;
  icon: string;
  close: boolean;
  badge?: number;
}

interface Ipc {
  publishMessage(channel: string, ...args: any[]): void;
  subscribeMessage(channel: string, listener: IpcEventListener): Disposable;
  unsubscribeMessage(channel: string, listener: IpcEventListener): void;
  
  setState<T>(newState: T): void;
  mergeState<T>(stateUpdate: T): void;
  updateState<T>(modification: (state: T) => void): void
  getState<T>(filter?: (state: T) => boolean): Promise<T>;
  subscribeState<T>(listener: StateChangeListener<T>): Disposable;
  unsubscribeState<T>(listener: StateChangeListener<T>): boolean;
}

type StateChangeListener<T> = (newState: T) => void;

interface Disposable {
  Dispose(): void;
}

interface IpcSender {
  send(channel: string, ...args: any[]): void;
}

interface IpcEvent {
  sender: IpcSender;
}

type IpcEventListener = (event: IpcEvent, ...args: any[]) => void;

