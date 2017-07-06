import { combineReducers } from 'redux';
import { handleActions, Action } from 'redux-actions';
import { AppState } from '../types';
import { DEFAULT_STATE, SET_VIEW } from '../constants';

const mainViewSrc = handleActions<string>({

  [SET_VIEW]: (state: string, action: Action<string>): string =>
    action.payload || state,

}, DEFAULT_STATE.mainViewSrc);

const combinedReducers = combineReducers<AppState>({
  mainViewSrc
});

export default function rootReducer(state: AppState = DEFAULT_STATE, action: Action<AppState>) {
  switch (action.type) {
    default:
      return combinedReducers(state, action);
  }
}
