require('fix-path')();
import { app, BrowserWindow } from 'electron';
import * as nodeRed from './nodeRed';
import { initializeStore } from './InitializeStore';
import { updateNodeRED, showAdministration } from '../actions';

app.once('ready', () => {

  const defaultSettings = nodeRed.getDefaultSettings();
  const redInitialization = nodeRed.initialize(defaultSettings);

  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    show: false,
    center: true,
    autoHideMenuBar: true,
  });

  const store = initializeStore();

  redInitialization
    .then(settings => {
      store.dispatch(updateNodeRED(settings.functionGlobalContext));
      store.dispatch(showAdministration());
    })
    .catch(error => {
      console.error(error);
      app.quit();
    });

  mainWindow.loadURL(`file://${__dirname}/app.html`);
  mainWindow.once('close', () => app.quit());
  mainWindow.once('ready-to-show', mainWindow.show);
});
