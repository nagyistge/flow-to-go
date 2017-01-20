import { parse } from 'url';
const { BrowserWindow, shell } = require('electron').remote;

export function openUrl(href: string): void {
  const url = parse(href) as URL;
// @if DEBUG
  console.debug(`openUrl: ${JSON.stringify(url)}`);
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
}