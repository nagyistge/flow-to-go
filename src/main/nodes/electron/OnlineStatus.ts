import * as RED from 'node-red';

export const RegisterOnlineStatus = () => {
  RED.nodes.registerType('electron', 'online-status', function(config: {}) {

    RED.nodes.createNode(this, config);
    var node = this;
    // tslint:disable-next-line:no-any
    node.on('input', function (msg: any) {
      msg.payload = msg.payload.toLowerCase();
      alert(msg.payload);
      node.send(msg);
    });

  });
};
