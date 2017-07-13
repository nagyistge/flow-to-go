require('fix-path')();
import { app, BrowserWindow } from 'electron';
import { join } from 'path';
import * as nodeRed from './nodeRed';
import { initializeStore } from './InitializeStore';
import { updateNodeRED, showDashboard } from '../actions';

app.once('ready', () => {
  const redInitialization = nodeRed.initialize();

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
      const rootUrl = `http://${settings.hostname}:${settings.port}`;
      store.dispatch(updateNodeRED({
        port: settings.port,
        rootUrl,
        administration: `${rootUrl}${settings.httpAdminRoot}`,
        dashboard: `${rootUrl}${settings.ui.path}`,
        flowFile: join(settings.userDir, settings.flowFile)
      }));
      store.dispatch(showDashboard());
    })
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
