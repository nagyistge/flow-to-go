import './app.css';

import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { initializeStore } from './InitializeStore';
import MainView from './containers/MainView';
import ApplicationMenu, { buildMenuTemplate } from './components/ApplicationMenu';

const store = initializeStore();

const template = buildMenuTemplate();
render(
  <Provider store={store}>
    <div>
      <ApplicationMenu
        menuItems={template}
      />
      <MainView />
    </div>
  </Provider>,
  document.getElementById('app')
);
