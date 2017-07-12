import * as express from 'express';
import * as http from 'http';
import { app } from 'electron';
import { NodeRed } from '../types';

import * as RED from 'node-red';

export interface NodeRedSettings extends RED.UserSettings {
  functionGlobalContext: NodeRed;
}

export function getDefaultSettings(): NodeRedSettings {
  return {
    httpAdminRoot: '/admin',
    ui: { path: '/ui' },
    httpNodeRoot: '/',
    logging: {
      console: {
        level: 'info',
        metrics: false,
        audit: false,
      }
    },
    userDir: app.getPath('userData'),
    flowFile: 'flows.json',
    editorTheme: {
      page: {
        title: app.getName(),
      },
      header: {
        title: app.getName(),
        image: '',
        url: ''
      },
      palette: {
        catalogues: [
          'https://catalogue.nodered.org/catalogue.json',
        ],
      }
    },
    functionGlobalContext: {
      port: 0,
      administration: '',
      dashboard: '',
      rootUrl: ''
    }
  };
}

export async function initialize(nodeSettings: NodeRedSettings) {
  const redApp = express();
  RED.init(http.createServer(redApp), nodeSettings);

  redApp.all(RED.settings.httpAdminRoot + '*', (req, res, next) => {
    // admin access only from localhost
    if (req.ip === '::1' || req.ip === '127.0.0.1') {
      next();
      return;
    }
    res.sendStatus(403).end();
  });

  redApp.use(RED.settings.httpAdminRoot, RED.httpAdmin);
  redApp.use(RED.settings.httpNodeRoot, RED.httpNode);

  const redInitialization = RED.start().catch(console.error);
  return new Promise<NodeRedSettings>((resolve, reject) => {
    RED.server.listen(RED.settings.functionGlobalContext.port, '127.0.0.1', async () => {
      const port = RED.server.address().port;
      const rootUrl = `http://localhost:${port}`;
      RED.settings.functionGlobalContext.port = port;
      RED.settings.functionGlobalContext.administration = `${rootUrl}${RED.settings.httpAdminRoot}`;
      RED.settings.functionGlobalContext.dashboard = `${rootUrl}${RED.settings.ui.path}`;
      RED.settings.functionGlobalContext.rootUrl = rootUrl;
      await redInitialization;
      app.on('before-quit', () => RED.stop());
      RED.log.info(`port: ${RED.settings.functionGlobalContext.port}`);
      RED.log.info(`userDir: ${RED.settings.userDir}`);
      RED.log.info('private access on localhost');
      resolve(RED.settings as NodeRedSettings);
    });
  });
}
