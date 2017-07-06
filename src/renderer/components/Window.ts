import { parse } from 'url';
const { BrowserWindow, shell } = require('electron').remote;

export function openWindow(url: string, customOptions?: Electron.BrowserWindowConstructorOptions)
  : Electron.BrowserWindow {
  const defaultPreferences = {
    nodeIntegration: false,
    webSecurity: true,
    preload: `${__dirname}/preload.bundle.js`
  };
  const defaultOptions = {
    parent: BrowserWindow.getFocusedWindow(),
    width: 800,
    height: 600,
    show: false,
    modal: false,
    autoHideMenuBar: true,
    skipTaskbar: false
  };

  const options = { ...defaultOptions, ...customOptions };
  options.webPreferences = { ...defaultPreferences, ...options.webPreferences };
  let win = new BrowserWindow(options);

  win.loadURL(url);
  win.once('ready-to-show', win.show);
  win.on('closed', () => { win = null; });
  return win;
}

export function openUrl(href: string, customOptions?: Electron.BrowserWindowConstructorOptions)
  : boolean | Electron.BrowserWindow {
  if (!href) {
    return false;
  }

  const url = parse(href) as URL;
  if (url.hash) {
    return false;
  }

  if (url.hostname === 'localhost' || url.protocol === 'file:') {
    return openWindow(url.href, customOptions);
  } else {
    shell.openExternal(url.href);
  }
  return true;
}
