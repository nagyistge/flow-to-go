import * as RED from 'node-red';
import { printToPDF } from './PDF';

export const RegisterRenderPDF = () => {
  RED.nodes.registerType('electron', 'render-pdf', function (config: RED.NodeDefinition) {
    RED.nodes.createNode(this, config);
    const node: RED.Node = this;

    node.on('input', (msg: RED.Message) =>
      printToPDF(msg.payload)
        .do(buffer => node.send({ payload: buffer }))
        .subscribe(_ => _, error => node.error(error))
    );

  });
};
