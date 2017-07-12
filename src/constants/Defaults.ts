import { AppState } from '../types';

export const DEFAULT_STATE: AppState = {
  isOnline: false,
  mainViewSrc: '',
  nodeRed: {
    administration: '',
    dashboard: '',
    flowFile: '',
    port: 0,
    rootUrl: ''
  }
};
