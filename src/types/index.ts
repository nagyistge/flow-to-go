import { Store, Action } from 'redux';

export interface AppState {
  isOnline: boolean;
  mainViewSrc: string;
  nodeRedAdministration: string;
  nodeRedDashboard: string;
}

export interface NodeRed {
  port: number;
  administration: string;
  dashboard: string;
  rootUrl: string;
}

export interface ExtendedStore<A> extends Store<A> {
  dispatch(promise: Promise<Action>): Promise<Action>;
  dispatch(func: (dispatch: {}, getState?: () => A) => void): void;
  dispatch<A extends Action>(action: A): A;
}
