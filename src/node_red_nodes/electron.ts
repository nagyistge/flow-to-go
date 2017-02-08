import { Observable, Subject, SerialDisposable } from 'rx';

module.exports = function (RED: any) {
  const ipc = require('../../../../helpers/ipc') as Ipc;

  // Notification

  function Notification(config: any) {
    RED.nodes.createNode(this, config);
    const node = this;
    node.topic = config.topic;
    node.title = config.title;
    node.body = config.body;

    node.on('input', function (msg: any) {
      const notification = {
        title: node.title || msg.payload.title,
        body: node.body || msg.payload.body
      };
      ipc.publishMessage('notification', notification);
    });
  }

  RED.nodes.registerType('electron-notification', Notification);

  // MenuItem

  function MenuItem(config: any) {
    RED.nodes.createNode(this, config);
    const node = this;
    node.icon = config.icon;
    node.topic = config.topic;
    node.closeOnTap = config.close;

    const button: MenuItem = { id: node.id, icon: node.icon, close: node.closeOnTap };

    const subscription = ipc.subscribeMessage(node.id, (event, payload) => {
      node.send({ topic: node.topic, payload });
    });
    
    ipc.updateState((state: any) => state.menuItems.push(button));
    node.on('close', () => {
      subscription.Dispose();
      ipc.updateState((state: any) => state.menuItems = state.menuItems.filter((item: any) => item.id !== node.id));
    });
  }

  RED.nodes.registerType('electron-menu-item', MenuItem);

  // MainView

  function MainView(config: any) {
    RED.nodes.createNode(this, config);
    const node = this;
    node.url = config.url;

    node.on('input', (msg:{ url:string }) => {
      ipc.updateState<globalState>(state => {
        const newUrl = msg.url || node.url;
        if (newUrl) { state.currentView = newUrl; }
        else { node.error('Url is required.'); }
      });
    });
  }

  RED.nodes.registerType('electron-main-view', MainView);

  // OnlineStatus

  function OnlineStatus(config: any) {
    RED.nodes.createNode(this, config);
    const node = this;
    node.topic = config.topic;
    node.title = config.title;

    const emitOnline = function () {
      node.status({ fill: 'green', shape: 'dot', text: 'online' });
      node.send({ payload: true, topic: node.topic });
    };

    const emitOffline = function () {
      node.status({ fill: 'red', shape: 'dot', text: 'offline' });
      node.send({ payload: false, topic: node.topic });
    };

    node.on('close', function () {
      onlineSubscription.Dispose();
      offlineSubscription.Dispose();
    });

    const onlineSubscription = ipc.subscribeMessage('online', emitOnline);
    const offlineSubscription = ipc.subscribeMessage('offline', emitOffline);
    ipc.publishMessage('online-status');
  }

  RED.nodes.registerType('electron-online-status', OnlineStatus);

  // BrowserWindow
  function BrowserWindow(config: any) {
    RED.nodes.createNode(this, config);

    const { BrowserWindow } = require('electron');

    const node = this as { browser: Electron.BrowserWindow, on: any, id: string };
    node.browser = new BrowserWindow({
      title: config.name,
      width: 800,
      height: 600,
      show: config.show,
      autoHideMenuBar: true,
      skipTaskbar: false,
      closable: false,
      enableLargerThanScreen: true,
      webPreferences: {
        nodeIntegration: config.nodeIntegration,
        devTools: config.devtools && config.show,
        webSecurity: true,
        partition: node.id
      }
    });

    if (config.devtools && config.show) {
      node.browser.webContents.openDevTools({ mode: 'bottom' });
    }

    node.on('close', () => {
      node.browser.destroy();
      node.browser = null;
    });
  }
  RED.nodes.registerType('electron-browser-window', BrowserWindow);

  // print-pdf
  function PrintPDF(config: any) {
    RED.nodes.createNode(this, config);
    const node = this;
    node.status({});
    const browser = RED.nodes.getNode(config.window).browser as Electron.BrowserWindow;
    const loadFailureStream = Observable
      .fromEventPattern(
      h => browser.webContents.addListener('did-fail-load', h),
      h => browser.webContents.addListener('did-fail-load', h),
      (event: Electron.Event, errorCode: number, errorDescription: string) => { return { errorCode, errorDescription }; }
      )
      .filter(failure => failure.errorCode !== -3);

    const loadFinishStream = Observable
      .fromEvent(browser.webContents, 'did-finish-load');

    function setStatus(status: string, url: string) {
      switch (status) {
        case 'loading':
          node.status({ fill: 'yellow', shape: 'ring', text: url });
          node.send({ payload: { isReady: false, url } });
          break;
        case 'error':
          node.error(`Load failed ${url}`);
          node.status({ fill: 'red', shape: 'dot', text: url });
          break;
        case 'ready':
          node.status({ fill: 'green', shape: 'dot', text: url });
          node.send({ payload: { isReady: true, url } });
          break;
      }
    }
    const pdfTasks = new Subject<any>();
    const subscription = new SerialDisposable();

    function loadURL(newUrl: string) {
      subscription.setDisposable(Observable
        .return(newUrl)
        .filter(url => !!url === true)
        .do(url => {
          browser.webContents.loadURL(url);
          setStatus('loading', url);
        })
        .flatMap(url => Observable.amb(
          loadFailureStream.do(_ => setStatus('error', url)).map(_ => false),
          loadFinishStream.do(_ => setStatus('ready', url)).map(_ => true)
        ).first()
        )
        .filter(isReady => isReady)
        .combineLatest(pdfTasks)
        .debounce(500)
        .do(async data => {
          const [, pdfTask] = data;
          return await new Promise((resolve, reject) =>
            browser.webContents.printToPDF(pdfTask.options, (error, buffer) => {
              if (error) { reject(); }
              else {
                pdfTask.msg.payload = buffer;
                node.send([, pdfTask.msg]);
                resolve();
              }
            })
          );
        })
        .subscribe()
      );
    }

    loadURL(config.url);

    node.on('close', () => subscription.dispose());
    node.on('input', async function (msg: any) {
      if (msg.url) {
        loadURL(msg.url);
      }
      pdfTasks.onNext({
        msg,
        options: {
          marginsType: config.marginsType,
          pageSize: config.pageSize,
          printBackground: config.printBackground,
          printSelectionOnly: config.printSelectionOnly,
          landscape: config.landscape,
        }
      });
    });
  }

  RED.nodes.registerType('electron-print-pdf', PrintPDF);
};
