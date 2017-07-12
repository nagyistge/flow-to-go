require('fix-path')();
import { app, BrowserWindow, Tray } from 'electron';
import { join } from 'path';
import * as nodeRed from './nodeRed';
import { initializeStore } from './InitializeStore';
import { updateNodeRED, showDashboard } from '../actions';

let tray: Electron.Tray;

app.once('ready', () => {
  tray = new Tray(join(__dirname, 'icons', 'cog.png'));
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
        dashboard: `${rootUrl}${settings.ui.path}`
      }));
      store.dispatch(showDashboard());
    })
    .catch(error => {
      console.error(error);
      app.quit();
    });

  const showWindow = () => {
    mainWindow.show();
    mainWindow.focus();
  };

  const toggleWindow = () => mainWindow.isVisible()
    ? mainWindow.hide()
    : showWindow();

  mainWindow.loadURL(`file://${__dirname}/app.html`);
  mainWindow.once('close', () => app.quit());
  mainWindow.once('ready-to-show', () => {
    tray.on('right-click', toggleWindow);
    tray.on('double-click', toggleWindow);
    tray.on('click', toggleWindow);
    showWindow();
  });
});
