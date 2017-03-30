require('fix-path')();

import * as path from 'path';
import * as nodeRed from './main_process/node_red';
import * as ApplicationMenu from './main_process/application_menu';
import * as ipc from './helpers/ipc';
import { app, Menu, BrowserWindow } from 'electron';

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

  // @if DEBUG
  const extensions = BrowserWindow.getDevToolsExtensions();
  if (!extensions['devtron']) {
    BrowserWindow.addDevToolsExtension(path.join(__dirname, '../../node_modules/devtron'));
  }
  // @endif

  mainWindow.once('close', () => app.quit());

  const settings = await redInitialization;

  const initialState:globalState = {
    nodeRedUrl: settings.functionGlobalContext.rootUrl,
    nodeRedAdmin: settings.functionGlobalContext.administration,
    nodeRedUI: settings.functionGlobalContext.dashboard,
    graphQL: settings.functionGlobalContext.graphQL,
    currentView: settings.functionGlobalContext.administration,
    menuOpen: false,
    menuItems: [
      { id: 'onShowAdmin', icon: 'fa fa-cogs' },
      { id: 'onShowUI', icon: 'fa fa-eye' },
      { id: 'onShowGraphiQL', icon: 'fa fa-flash' }
    ] as MenuItem[]
  };
  
  ipc.mergeState<globalState>(initialState);

  mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.once('ready-to-show', mainWindow.show);
  
  const menuTemplate = ApplicationMenu.createTemplate(initialState, app);
  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
});
