import { Dispatch } from 'redux';
import { createAction, Action } from 'redux-actions';
import { LOAD_VIEW, UPDATE_NODE_RED, UPDATE_ONLINE_STATE } from '../constants/ActionTypes';
import { AppState, NodeRed } from '../types';

const loadView = createAction<string>(LOAD_VIEW);
export const updateNodeRED = createAction<NodeRed>(UPDATE_NODE_RED);
export const updateOnlineState = createAction<boolean>(UPDATE_ONLINE_STATE);

export function showAdministration() {
  return (dispatch: Dispatch<Action<{}>>, getState: () => AppState) => {
    const currentState = getState();
    if (currentState.mainViewSrc !== currentState.nodeRedAdministration) {
      dispatch(loadView(currentState.nodeRedAdministration));
    }
  };
}

export function showDashboard() {
  return (dispatch: Dispatch<Action<{}>>, getState: () => AppState) => {
    const currentState = getState();
    if (currentState.mainViewSrc !== currentState.nodeRedDashboard) {
      dispatch(loadView(currentState.nodeRedDashboard));
    }
  };
}
