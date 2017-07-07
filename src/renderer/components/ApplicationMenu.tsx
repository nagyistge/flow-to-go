import { remote } from 'electron';
import * as React from 'react';

const { shell, app, webContents } = remote;
const { buildFromTemplate, setApplicationMenu } = remote.Menu;

interface Props {
  showAdministration: () => void;
  showDashboard: () => void;
}

export default class ApplicationMenu extends React.Component<Props, {}> {

  domNode: HTMLDivElement;

  componentDidMount() {
    this.renderMenu(buildMenuTemplate(this.props));
    this.domNode.remove();
    this.domNode = null;
  }

  componentDidUpdate() {
    console.warn('menu update');
    this.renderMenu(buildMenuTemplate(this.props));
  }

  componentWillUnmount() {
    this.renderMenu([]);
  }

  renderMenu(menuItems: Electron.MenuItemConstructorOptions[]) {
    setApplicationMenu(buildFromTemplate(menuItems));
  }

  render() {
    return <div ref={(div) => this.domNode = div}/>;
  }
}

function buildMenuTemplate({ showAdministration, showDashboard}: Props): Electron.MenuItemConstructorOptions[] {
  // tslint:disable-next-line:no-any
  const template: any[] = [
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteandmatchstyle' },
        { role: 'delete' },
        { role: 'selectall' },
        { type: 'separator' },
        { label: 'Open Working Directory', click() { shell.openItem(app.getPath('userData')); } }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Alt+CmdOrCtrl+i',
          click() {
            const focused = webContents.getFocusedWebContents();
            if (focused) { focused.toggleDevTools(); }
          }
        },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
        { type: 'separator' },
        {
          label: 'Show Administration',
          click: showAdministration
        },
        {
          label: 'Show Dashboard',
          click: showDashboard
        }
      ]
    },
    {
      role: 'window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click() { shell.openExternal('https://electron.atom.io'); }
        }
      ]
    }
  ];

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services', submenu: [] },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    });

    // Edit menu
    template[1].submenu.push(
      { type: 'separator' },
      {
        label: 'Speech',
        submenu: [
          { role: 'startspeaking' },
          { role: 'stopspeaking' }
        ]
      }
    );

    // Window menu
    template[3].submenu = [
      { role: 'close' },
      { role: 'minimize' },
      { role: 'zoom' },
      { type: 'separator' },
      { role: 'front' }
    ];
  }
  return template;
}
