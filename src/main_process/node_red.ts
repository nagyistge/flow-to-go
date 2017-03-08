import * as express from 'express';
import * as http from 'http';
import { getHttpMiddleware, setRootValue, setSchema } from '../helpers/graphQL';

const { app } = require('electron');
const RED = require('node-red');

export interface NodeRedGlobals {
  port: number;
  graphQL: string;
  administration: string;
  dashboard: string;
  rootUrl: string;
}

export interface NodeRedSettings {
  httpAdminRoot: string;
  httpNodeRoot: string;
  httpGraphQLRoot: string;
  httpUIRoot: string;
  userDir: string;
  functionGlobalContext: NodeRedGlobals;
}

export function getDefaultSettings() {
  return <NodeRedSettings>{
    httpAdminRoot: '/admin',
    httpGraphQLRoot: '/graphql',
    httpUIRoot: '/ui',
    httpNodeRoot: '/',
    userDir: app.getPath('userData'),
    flowFile: 'flows.json',
    editorTheme: {
      page: {
        title: 'Administration'
      },
      header: {
        title: 'Administration',
        image: <string>null
      },
      deployButton: {
        type: 'simple',
        label: 'Save'
      },
      menu: {
        'menu-item-import-library': true,
        'menu-item-export-library': true,
        'menu-item-keyboard-shortcuts': true,
        'menu-item-help': false
      },
      userMenu: false,
      palette: {
        catalogues: [
          'http://catalogue.nodered.org/catalogue.json',
        ],
        editable: true
      }
    },
    functionGlobalContext: {
      port: 0,
      graphQL: null,
      administration: null,
      dashboard: null,
      rootUrl: null
    }
  };
}

export async function initialize(nodeSettings: NodeRedSettings) {
  const redApp = express();
  const server = http.createServer(redApp);

  RED.init(server, nodeSettings);

  redApp.all(nodeSettings.httpAdminRoot + '*', (req, res, next) => {
    //admin access only from localhost
    if (req.ip === '::1' || req.ip === '127.0.0.1') {
      next();
      return;
    }
    res.sendStatus(403).end();
  });

  redApp.use(nodeSettings.httpAdminRoot, RED.httpAdmin);
  redApp.use(nodeSettings.httpNodeRoot, RED.httpNode);

  setRootValue({
    foobar: false,
    hello: () => {
      this.foobar = !this.foobar;
      return this.foobar ? 'foo' : 'bar';
    },
  });
  
  redApp.use(nodeSettings.httpGraphQLRoot, getHttpMiddleware());

  const redInitialization = RED.start();
  return new Promise<NodeRedSettings>((resolve, reject) => {
    server.listen(nodeSettings.functionGlobalContext.port, '127.0.0.1', async () => {
      const port = server.address().port;
      const rootUrl = `http://localhost:${port}`;
      nodeSettings.functionGlobalContext.port = port;
      nodeSettings.functionGlobalContext.administration = `${rootUrl}${nodeSettings.httpAdminRoot}`;
      nodeSettings.functionGlobalContext.dashboard = `${rootUrl}${nodeSettings.httpUIRoot}`;
      nodeSettings.functionGlobalContext.graphQL = `${rootUrl}${nodeSettings.httpGraphQLRoot}`;
      await redInitialization;
      app.on('before-quit', () => RED.stop());
      RED.log.info(`port: ${nodeSettings.functionGlobalContext.port}`);
      RED.log.info(`userDir: ${nodeSettings.userDir}`);
      RED.log.info('private access on localhost');
      resolve(nodeSettings);
    });
  });
}