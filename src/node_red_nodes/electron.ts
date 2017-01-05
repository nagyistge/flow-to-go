// import * as ipc from "../helpers/ipc";

module.exports = function (RED: any) {
  const ipc = require("../../../../helpers/ipc");

  // Notification

  function Notification(config: any) {
      RED.nodes.createNode(this, config);
      const node = this;
      node.topic = config.topic;
      node.title = config.title;
      node.body = config.body;

      node.on('input', function(msg: any) {
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
      center: true,
      autoHideMenuBar: true
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
    // const node = this;
  }

  RED.nodes.registerType('electron-browser', Browser);
};
