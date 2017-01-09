import { Observable, Subject, SerialDisposable } from 'rx';

module.exports = function (RED: any) {
  const ipc = require('../../../../helpers/ipc');

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

    this.browser = new BrowserWindow({
      title: config.name,
      width: 1024,
      height: 768,
      show: config.show,
      autoHideMenuBar: true,
      skipTaskbar: false,
      closable: false,
      webPreferences: {
        nodeIntegration: config.nodeIntegration,
      },
    });

    this.on('close', () => {
      this.browser.destroy();
      this.browser = null;
    });
  }
  RED.nodes.registerType('electron-browser-window', BrowserWindow);

  // Browser
  function Browser(config: any) {
    RED.nodes.createNode(this, config);
    const node = this;
    const browser = RED.nodes.getNode(config.window).browser as Electron.BrowserWindow;

    const loadFailureStream = Observable
      .fromEvent<{ event: Electron.Event, errorCode: number, errorDescription: string }>(browser.webContents, 'did-fail-load')

    const loadFinishStream = Observable
      .fromEvent(browser.webContents, 'did-finish-load');

    const pdfTasks = new Subject<{ msg: any, options: Electron.PrintToPDFOptions }>();
    function setStatus(status: string, url: string) {
      const msg = { payload: { status, url } };
      switch (status) {
        case 'loading':
          node.status({ fill: 'yellow', shape: 'ring', text: url });
          node.send(msg);
          break;
        case 'error':
          node.error(`Load failed ${url}`);
          node.status({ fill: 'red', shape: 'dot', text: url });
          break;
        case 'ready':
          node.status({ fill: 'green', shape: 'dot', text: url });
          node.send(msg);
          break;
      }
    }

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
        .debounce(1000)
        .do(async data => {
          const [, pdfTask] = data;
          return await new Promise<void>((reject, resolve) =>
            browser.webContents.printToPDF(pdfTask.options,(error, data) => {
              if (error) { reject(); }
              else {
                pdfTask.msg.payload = data;
                node.send(pdfTask.msg);
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
      if (msg.payload.url){
        loadURL(msg.payload.url);
      }
      switch (config.action) {
        case 'printToPDF':
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
          break;
        default:
          node.error(`unknown action ${config.action}`, msg);
      }
    });
  }

  RED.nodes.registerType('electron-browser', Browser);
};
