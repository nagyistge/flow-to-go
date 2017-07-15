import * as RED from 'node-red';
import { Observable } from 'rxjs';

export const RegisterOnlineStatus = (isOnlineStream: Observable<boolean>) => {
  RED.nodes.registerType('electron', 'online-status', function (config: {}) {

    RED.nodes.createNode(this, config);
    var node: RED.Node = this;

    const onNext = (isOnline: boolean) => {
      if (isOnline) {
        node.status({ fill: 'green', shape: 'dot', text: 'connected' });
      } else {
        node.status({ fill: 'red', shape: 'ring', text: 'disconnected' });
      }
      node.send({ payload: isOnline });
    };

    const subscription = isOnlineStream
      .do(onNext, node.error)
      .subscribe();

    node.on('close', () => subscription.unsubscribe());

  });
};
