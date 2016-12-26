// import * as ipc from "../helpers/ipc";

module.exports = function (RED: any) {
  const ipc = require("../../../../helpers/ipc");

  // Notification

  function Notification(config: any) {
      RED.nodes.createNode(this, config);
      let node = this;
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
      onlineSubscription.Dispose();
      offlineSubscription.Dispose();
    });

    const onlineSubscription = ipc.subscribeMessage('online', emitOnline);
    const offlineSubscription = ipc.subscribeMessage('offline', emitOffline);
    ipc.publishMessage('online-status');
  }

  RED.nodes.registerType('electron-online-status', OnlineStatus);
};
