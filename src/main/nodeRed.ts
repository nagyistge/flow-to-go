import * as express from 'express';
import * as http from 'http';
import { app } from 'electron';

import * as RED from 'node-red';
import { RegisterOnlineStatus } from './nodes/electron/OnlineStatus';

export interface NodeRedSettings extends RED.UserSettings {
  userDir: string;
  ui: { path: string };
  httpAdminRoot: string;
  httpNodeRoot: string;
  hostname: string;
  port: number;
  flowFile: string;
}

export function getDefaultSettings(): NodeRedSettings {
  return {
    hostname: '127.0.0.1',
    port: 0,
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
  };
}

export async function initialize(nodeSettings: NodeRedSettings = getDefaultSettings()): Promise<NodeRedSettings> {
  const redApp = express();
  const server = http.createServer(redApp);
  return new Promise<NodeRedSettings>((resolve, reject) => {
    server.listen(nodeSettings.port, nodeSettings.hostname, async () => {
      try {
        RED.init(server, { ...nodeSettings, port: server.address().port } as NodeRedSettings);
        // tslint:disable-next-line:no-any
        const settings: NodeRedSettings = RED.settings as any;

        redApp
          .all(settings.httpAdminRoot + '*', (req, res, next) => {
            // admin access only from localhost
            if (req.ip === '::1' || req.ip === '127.0.0.1') {
              next();
              return;
            }
            res.sendStatus(403).end();
          })
          .use(settings.httpAdminRoot, RED.httpAdmin)
          .use(settings.httpNodeRoot, RED.httpNode);

        await RED.start();
        app.on('before-quit', () => RED.stop());
        RED.log.info(`hostname: ${settings.hostname}`);
        RED.log.info(`port: ${settings.port}`);

        RegisterOnlineStatus();

        // tslint:disable-next-line:no-any
        resolve(settings as any);
      } catch (error) {
        reject(error);
      }
    });
  });
}
