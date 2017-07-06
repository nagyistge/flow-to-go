import { createStore, applyMiddleware, compose } from 'redux';
import reducers from '../reducers';
import { AppState, ExtendedStore } from '../types';
import { thunk, vanillaPromise } from '../redux/middleware';

const {
  forwardToMain,
  replayActionRenderer,
  getInitialStateRenderer,
} = require('electron-redux');

export function initializeStore(): ExtendedStore<AppState> {
  // tslint:disable-next-line:no-any
  const composeEnhancers = (<any> window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const initialState = getInitialStateRenderer();
  const enhancers = composeEnhancers(applyMiddleware(forwardToMain, thunk, vanillaPromise));
  
  const store = createStore<AppState>(reducers, initialState, enhancers);
  replayActionRenderer(store);
  return store;
}
