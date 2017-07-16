﻿import * as RED from 'node-red';
import { Observable } from 'rxjs';

export const RegisterNetworkStatus = (isConnectedStream: Observable<boolean>) => {
  RED.nodes.registerType('electron', 'network-status', function (config: RED.NodeDefinition) {
    RED.nodes.createNode(this, config);
    const node: RED.Node = this;

    const onNext = (msg: RED.Message) => {
      if (msg.payload) {
        node.status({ fill: 'green', shape: 'dot', text: 'connected' });
      } else {
        node.status({ fill: 'red', shape: 'ring', text: 'disconnected' });
      }
      node.send(msg);
    };

    const subscription = isConnectedStream
      .do(isConnected => onNext({ payload: isConnected }), node.error)
      .subscribe();

    node.on('close', () => subscription.unsubscribe());
  });
};
