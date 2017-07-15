import { createStore, applyMiddleware, compose } from 'redux';
import reducers from '../reducers';
import { AppState, ExtendedStore } from '../types';
import { thunk, vanillaPromise } from '../redux/middleware';

const {
  forwardToRenderer,
  triggerAlias,
  replayActionMain,
} = require('electron-redux');

export function initializeStore(state?: AppState): ExtendedStore<AppState> {
  // tslint:disable-next-line:no-any
  const enhancers = compose(applyMiddleware(triggerAlias, thunk, vanillaPromise, forwardToRenderer));
  
  const store = state
    ? createStore<AppState>(reducers, state, enhancers)
    : createStore<AppState>(reducers, enhancers);
  
  replayActionMain(store);
  return store;
}