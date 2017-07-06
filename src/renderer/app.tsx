import './app.css';

import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { initializeStore } from './InitializeStore';
import MainView from './containers/MainView';

const store = initializeStore();

render(
  <Provider store={store}>
    <MainView/>
  </Provider>,
  document.getElementById('app')
);
