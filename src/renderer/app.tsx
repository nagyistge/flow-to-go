import './app.css';

import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { initializeStore } from './InitializeStore';
import MainView from './containers/MainView';
import ApplicationMenu from './containers/ApplicationMenu';
import TrayMenu from './containers/TrayMenu';

const store = initializeStore();

render(
  <Provider store={store}>
    <div>
      <ApplicationMenu />
      <TrayMenu />
      <MainView />
    </div>
  </Provider>,
  document.getElementById('app')
);
