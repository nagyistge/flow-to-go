import { combineReducers } from 'redux';
import { handleActions, Action } from 'redux-actions';
import { AppState, NodeRed } from '../types';
import { DEFAULT_STATE, LOAD_VIEW, UPDATE_NODE_RED, UPDATE_ONLINE_STATE } from '../constants';

const mainViewSrc = handleActions<string>({

  [LOAD_VIEW]: (state: string, action: Action<string>): string =>
    action.payload || state,

}, DEFAULT_STATE.mainViewSrc);

const nodeRed = handleActions<NodeRed>({

  [UPDATE_NODE_RED]: (state: NodeRed, action: Action<NodeRed>): NodeRed =>
    (action.payload !== undefined) ? action.payload : state,

}, DEFAULT_STATE.nodeRed);

const isConnected = handleActions<boolean>({

  [UPDATE_ONLINE_STATE]: (state: boolean, action: Action<boolean>): boolean =>
    (action.payload !== undefined) ? action.payload : state,

}, DEFAULT_STATE.isConnected);

export default combineReducers<AppState>({
  isConnected,
  mainViewSrc,
  nodeRed
});
