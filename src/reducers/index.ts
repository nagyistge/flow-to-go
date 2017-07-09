import { combineReducers } from 'redux';
import { handleActions, Action } from 'redux-actions';
import { AppState, NodeRed } from '../types';
import { DEFAULT_STATE, LOAD_VIEW, UPDATE_NODE_RED, UPDATE_ONLINE_STATE } from '../constants';

const mainViewSrc = handleActions<string>({

  [LOAD_VIEW]: (state: string, action: Action<string>): string =>
    action.payload || state,

}, DEFAULT_STATE.mainViewSrc);

const nodeRedAdministration = handleActions<string>({

  [UPDATE_NODE_RED]: (state: string, action: Action<NodeRed>): string =>
    (action.payload !== undefined) ? action.payload.administration : state,

}, DEFAULT_STATE.nodeRedAdministration);

const nodeRedDashboard = handleActions<string>({

  [UPDATE_NODE_RED]: (state: string, action: Action<NodeRed>): string =>
    (action.payload !== undefined) ? action.payload.dashboard : state,

}, DEFAULT_STATE.nodeRedDashboard);

const isOnline = handleActions<boolean>({

  [UPDATE_ONLINE_STATE]: (state: boolean, action: Action<boolean>): boolean =>
    (action.payload !== undefined) ? action.payload : state,

}, DEFAULT_STATE.isOnline);

export default combineReducers<AppState>({
  isOnline,
  mainViewSrc,
  nodeRedAdministration,
  nodeRedDashboard
});
