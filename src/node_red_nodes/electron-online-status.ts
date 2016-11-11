// import * as MessageBus from "../helpers/message_bus";

module.exports = function (RED: any) {
  const MessageBus = require("../../../../helpers/message_bus");
  
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
      onlineSubscription.Dispose();
      offlineSubscription.Dispose();
    });

    const onlineSubscription = MessageBus.subscribe('online', emitOnline);
    const offlineSubscription = MessageBus.subscribe('offline', emitOffline);
    MessageBus.publish('online-status');
  }

  RED.nodes.registerType('electron-online-status', Initialize);
};
