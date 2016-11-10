module.exports = function (RED: any) {
  const { ipcMain, app } = require('electron');

  function Initialize(config: any) {
    RED.nodes.createNode(this, config);
    let node = this;
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
      ipcMain.removeListener('online', emitOnline);
      ipcMain.removeListener('offline', emitOffline);
    });

    ipcMain.on('online', emitOnline);
    ipcMain.on('offline', emitOffline);
    (<any>app).mainWindow.webContents.send('online-status');
  }

  RED.nodes.registerType('electron-online-status', Initialize);
};
