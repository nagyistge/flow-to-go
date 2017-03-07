﻿import * as express from 'express';
import * as http from 'http';
import { graphql, buildSchema } from 'graphql';

const { app } = require('electron');
const RED = require('node-red');

export interface NodeRedGlobals {
  port: number;
}

export interface NodeRedSettings {
  httpAdminRoot: string;
  httpNodeRoot: string;
  userDir: string;
  functionGlobalContext: NodeRedGlobals;
}

export function getDefaultSettings() {
  return <NodeRedSettings>{
    httpAdminRoot: '/admin',
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

  // Construct a schema, using GraphQL schema language
  var schema = buildSchema(`
    type Query {
      hello: String
    }
  `);

  // The root provides a resolver function for each API endpoint
  var root = {
    hello: () => {
      return 'Hello world!';
    },
  };

  graphql(schema, '{ hello }', root).then((response) => {
    console.log(response);
  });

  const redInitialization = RED.start();
  return new Promise<NodeRedSettings>((resolve, reject) => {
    server.listen(nodeSettings.functionGlobalContext.port, '127.0.0.1', async () => {
      nodeSettings.functionGlobalContext.port = server.address().port;
      await redInitialization;
      app.on('before-quit', () => RED.stop());
      RED.log.info(`port: ${nodeSettings.functionGlobalContext.port}`);
      RED.log.info(`userDir: ${nodeSettings.userDir}`);
      RED.log.info('private access on localhost');
      resolve(nodeSettings);
    });
  });
}