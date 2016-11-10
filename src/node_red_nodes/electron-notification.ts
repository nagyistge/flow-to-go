module.exports = function (RED:any) {
  const { app } = require('electron');

  function Initialize (config:any) {
    RED.nodes.createNode(this, config);
    let node = this;
    node.topic = config.topic;
    node.title = config.title;
    node.body = config.body;

    node.on('input', function (msg: any) {
      const notification = {
        title: node.title || msg.payload.title,
        body: node.body || msg.payload.body
      };
      (<any>app).mainWindow.webContents.send('notification', notification);
    });
  }

  RED.nodes.registerType('electron-notification', Initialize);
}
