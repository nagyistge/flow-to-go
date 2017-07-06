import { Dispatch } from 'redux';
import { createAction, Action } from 'redux-actions';
import { SET_VIEW } from '../constants/ActionTypes';
import { AppState } from '../types';

const setView = createAction<string>(SET_VIEW);

export function showAdministration() {
  return (dispatch: Dispatch<Action<{}>>, getState: () => AppState) => {
    const currentState = getState();
    if (currentState.mainViewSrc !== currentState.nodeRed.administration) {
      dispatch(setView(currentState.nodeRed.administration));
    }
  };
}

export function showDashboard() {
  return (dispatch: Dispatch<Action<{}>>, getState: () => AppState) => {
    const currentState = getState();
    if (currentState.mainViewSrc !== currentState.nodeRed.dashboard) {
      dispatch(setView(currentState.nodeRed.dashboard));
    }
  };
}
