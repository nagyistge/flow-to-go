import * as RED from 'node-red';
import { Observable } from 'rxjs';

export const RegisterOnlineStatus = (isOnlineStream: Observable<boolean>) => {
  RED.nodes.registerType('electron', 'online-status', function(config: {}) {

    RED.nodes.createNode(this, config);
    var node: RED.Node = this;

    const subscription = isOnlineStream
      .do(payload => node.send({ payload }))
      .subscribe();
    
    node.on('close', () => subscription.unsubscribe());

  });
};
