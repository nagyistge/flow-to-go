require('fix-path')();
import { app, BrowserWindow } from 'electron';

import * as nodeRed from './nodeRed';
import { initializeStore } from './InitializeStore';
import { showAdministration as initialView } from '../actions';
// import { showDashboard as initialView } from '../actions';

app.once('ready', () => {

  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    show: false,
    center: true,
    autoHideMenuBar: true,
  });

  const store = initializeStore();
  nodeRed
    .initialize(store)
    .then(() => store.dispatch(initialView()))
    .catch(error => {
      console.error(error);
      app.quit();
    });

  mainWindow.loadURL(`file://${__dirname}/app.html`);
  mainWindow.once('close', () => app.quit());
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });
});
