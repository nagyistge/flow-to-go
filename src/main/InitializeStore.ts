import { createStore, applyMiddleware, compose } from 'redux';
import reducers from '../reducers';
import { AppState, ExtendedStore } from '../types';
import { thunk, vanillaPromise } from '../redux/middleware';
import { Observable, Observer } from 'rxjs';

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

export function toObservable(store: ExtendedStore<AppState>): Observable<AppState> {
  return Observable.create((observer: Observer<AppState>) => {
    let dispose = store.subscribe(() => observer.next(store.getState()));
    observer.next(store.getState());
    return dispose;
  });
}
