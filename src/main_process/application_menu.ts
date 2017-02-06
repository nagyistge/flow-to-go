import { updateState, publishMessage } from '../helpers/ipc';

export function createTemplate(state: globalState, app: Electron.App, shell: Electron.Shell) {
  const template = [
    {
      label: 'Edit',
      submenu: [
          { label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
          { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
          { type: 'separator' },
          { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
          { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
          { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' },
          { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' },
          { type: 'separator' },
          { label: 'Open Working Directory', click() { shell.openItem(app.getPath('userData')); } }
      ]
    },
    {
      label: 'View',
      submenu: [
        { label: 'Reload', accelerator: 'CmdOrCtrl+R',
          click(item:Electron.MenuItem, focusedWindow:Electron.BrowserWindow) {
            if (focusedWindow) {
              focusedWindow.reload();
            }
          }
        },
        {
          label: 'Toggle Menu',
          accelerator: 'CommandOrControl+M',
          click() { publishMessage('toggleMenu'); }
        },
        { label: 'Toggle Full Screen', accelerator: (function() {
            if (process.platform === 'darwin') { return 'Ctrl+Command+F'; }
            else { return 'F11'; }
          })(),
          click(item:Electron.MenuItem, focusedWindow:Electron.BrowserWindow) {
            if (focusedWindow) {
              focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
            }
          }
        },
        { label: 'Toggle Developer Tools', accelerator: (function() {
            if (process.platform === 'darwin') { return 'Alt+Command+I'; }
            else { return 'Ctrl+Shift+I'; }
          })(),
          click(item:Electron.MenuItem, focusedWindow:Electron.BrowserWindow) {
            if (focusedWindow) { focusedWindow.webContents.toggleDevTools(); }
          }
        },
      ]
    },
    { label: 'Window', role: 'window',
      submenu: [
        { label: 'Minimize', accelerator: 'CmdOrCtrl+M', role: 'minimize' },
        { label: 'Close', accelerator: 'CmdOrCtrl+W', role: 'close' },
      ]
    },
    { label: 'Help', role: 'help',
      submenu: [
        { label: 'Learn More', click() { shell.openExternal('http://electron.atom.io'); } },
      ]
    },
  ] as any[];

  if (process.platform === 'darwin') {
    const name = app.getName();
    template.unshift({
      label: name,
      submenu: [
        { label: 'About ' + name, role: 'about' },
        { type: 'separator' },
        { label: 'Services', role: 'services', submenu: [] },
        { type: 'separator' },
        { label: 'Hide ' + name, accelerator: 'Command+H', role: 'hide' },
        { label: 'Hide Others', accelerator: 'Command+Shift+H', role: 'hideothers' },
        { label: 'Show All', role: 'unhide' },
        { type: 'separator' },
        { label: 'Quit', accelerator: 'Command+Q', click() { app.quit(); } },
      ]
    });
    const windowMenu = template.find((m) => m.role === 'window');
    if (windowMenu) {
      windowMenu.submenu.push(
        { type: 'separator' },
        { label: 'Bring All to Front', role: 'front' }
      );
    }
  }

  return template;
}