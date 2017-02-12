import { parse } from 'url';
import { isMainProcess } from './is-renderer';
const { BrowserWindow, shell } = isMainProcess() ? require('electron') : require('electron').remote;

export function openWindow(url: string, customOptions?: Electron.BrowserWindowOptions): Electron.BrowserWindow {
  const defaultPreferences = {
    nodeIntegration: false,
    webSecurity: true,
    preload: `${__dirname}/preload.js`
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

  const options = Object.assign(defaultOptions, customOptions);
  options.webPreferences = Object.assign(defaultPreferences, options.webPreferences);
  let win = new BrowserWindow(options);

  win.loadURL(url);
  win.once('ready-to-show', win.show);
  win.on('closed', () => { win = null; });
  return win;
}

export function openUrl(href: string, customOptions?: Electron.BrowserWindowOptions): boolean {
  if (!href) {
    return false;
  }

  const url = parse(href) as URL;
  if (url.hash) {
    return false;
  }
  // @if DEBUG
  console.info(`openUrl: ${url.href}`);
  // @endif

  if (url.hostname === 'localhost' || url.protocol === 'file:') {
    openWindow(url.href, customOptions);
  } else {
    shell.openExternal(url.href);
  }
  return true;
}