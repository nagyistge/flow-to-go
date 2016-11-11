// import * as MessageBus from "../helpers/message_bus";

module.exports = function (RED: any) {
  const MessageBus = require("../../../../helpers/message_bus");

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
      MessageBus.publish('notification', notification);
    });
  }

  RED.nodes.registerType('electron-notification', Initialize);
}
