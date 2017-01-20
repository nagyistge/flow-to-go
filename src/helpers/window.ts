import { parse } from 'url';
const { BrowserWindow, shell } = require('electron').remote;

export function openUrl(href: string): boolean {
  const url = parse(href) as URL;
  if (url.hash) {
    return false;
  }
  // @if DEBUG
  console.info(`openUrl: ${url.href}`);
  // @endif

  switch (url.hostname) {
    case 'localhost':
      let win = new BrowserWindow({
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
        }
      });
      win.loadURL(url.href);
      win.once('ready-to-show', win.show);
      win.on('closed', () => { win = null; });
      break;
    default:
      shell.openExternal(url.href);
  }
  return true;
}