require('fix-path')();
import { app, BrowserWindow } from 'electron';
import * as nodeRed from './nodeRed';
import { initializeStore } from './InitializeStore';
import { showDashboard } from '../actions';

app.once('ready', async () => {

  const defaultSettings = nodeRed.getDefaultSettings();
  const redInitialization = nodeRed.initialize(defaultSettings);

  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    show: false,
    center: true,
    autoHideMenuBar: true,
  });

  try {
    const settings = await redInitialization;
    initializeStore({
      mainViewSrc: settings.functionGlobalContext.administration,
      nodeRed: settings.functionGlobalContext
    });

    mainWindow.loadURL(`file://${__dirname}/app.html`);
    mainWindow.once('close', () => app.quit());
    mainWindow.once('ready-to-show', mainWindow.show);
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.error(error);
    app.quit();
  }

});
