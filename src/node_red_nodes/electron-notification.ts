// import * as ipc from "../helpers/ipc";

module.exports = function(RED: any) {
    const ipc = require("../../../../helpers/ipc");

    function Initialize(config: any) {
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

    RED.nodes.registerType('electron-notification', Initialize);
};
