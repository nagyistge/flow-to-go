import { AppState } from '../types';

export * from './ActionTypes';

export const DEFAULT_STATE: AppState = {
  mainViewSrc: '',
  nodeRed: {
    administration: '',
    dashboard: '',
    port: 0,
    rootUrl: '',
  }
};
