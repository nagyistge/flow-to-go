// tslint:disable-next-line:no-any
export const thunk = (store: any) => (next: any) => (action: any) =>
  typeof action === 'function'
    ? action(store.dispatch, store.getState)
    : next(action);

// tslint:disable-next-line:no-any
export const vanillaPromise = (store: any) => (next: any) => (action: any) => {
  if (typeof action.then !== 'function') {
    return next(action);
  }
  return Promise.resolve(action).then(store.dispatch);
};
