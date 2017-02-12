import { parse } from 'url';
import { isMainProcess } from './is-renderer';
const { BrowserWindow, shell } = isMainProcess() ? require('electron') : require('electron').remote;

export function openWindow(url: URL, options?: Electron.BrowserWindowOptions): Electron.BrowserWindow {
  const defaultOptions = {
    parent: BrowserWindow.getFocusedWindow(),
    width: 800,
    height: 600,
    show: false,
    modal: false,
    autoHideMenuBar: true,
    skipTaskbar: false,
    webPreferences: {
      nodeIntegration: false,
      webSecurity: true,
      preload: `${__dirname}/preload.js`
    }
  };
  let win = new BrowserWindow(Object.assign(defaultOptions, options));
  win.loadURL(url.href);
  win.once('ready-to-show', win.show);
  win.on('closed', () => { win = null; });
  return win;
}

export function openUrl(href: string, options?: Electron.BrowserWindowOptions): boolean {
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
    openWindow(url);
  } else {
    shell.openExternal(url.href);
  }
  return true;
}