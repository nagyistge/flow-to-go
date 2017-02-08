require('fix-path')();

import * as path from 'path';
import * as nodeRed from './main_process/node_red';
import * as ApplicationMenu from './main_process/application_menu';
import * as ipc from './helpers/ipc';
import { app, shell, Menu, BrowserWindow } from 'electron';

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

  const nodeRedUrl = `http://localhost:${settings.functionGlobalContext.port}`;
  const nodeRedAdmin = `${nodeRedUrl}/admin`;
  const initialState:globalState = {
    nodeRedUrl: `http://localhost:${settings.functionGlobalContext.port}`,
    nodeRedAdmin,
    currentView: nodeRedAdmin,
    menuOpen: false,
    menuItems: [{ id:'showAdmin', icon:'fa fa-cogs' } ] as MenuItem[]
  };
  ipc.subscribeMessage('showAdmin',() => ipc.mergeState({ currentView: nodeRedAdmin, menuOpen: false }));

  ipc.mergeState<globalState>(initialState);

  mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.once('ready-to-show', mainWindow.show);
  
  const menuTemplate = ApplicationMenu.createTemplate(initialState, app, shell);
  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
});
