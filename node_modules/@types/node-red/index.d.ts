// Type definitions for node-red <https://github.com/node-red/node-red>
// Project: node-red
// Definitions by: shortsn <https://github.com/shortsn>

import { Server } from 'http';
import { EventEmitter } from 'events';
import { Express } from 'express';

/**
 * Initialises Node-RED
 */
export function init(httpServer: Server, userSettings: UserSettings): void;
/**
 * Start Node-RED
 */
export function start(): Promise<void>;
/**
 * Stop Node-RED
 */
export function stop(): Promise<void>;
/**
 * Returns the version
 */
export function version(): string;
/**
 * The admin express application
 */
export const httpAdmin: Express;
/**
 * The node express application
 */
export const httpNode: Express;
/**
 * The http server instance
 */
export const server: Server;
/**
 * 
 */
export const log: Log;

export const nodes: any;
export const settings: any;
export const util: any;
export const library: any;

export interface Log {
  FATAL: number,
  ERROR: number,
  WARN: number,
  INFO: number,
  DEBUG: number,
  TRACE: number,
  AUDIT: number,
  METRIC: number,

  /**
   * example: log.addHandler(new EventEmitter().on('log', console.log));
   */
  addHandler: (handler: LogHandler) => void;
  removeHandler: (handler: LogHandler) => void;

  log: (msg: { level: number, msg: string }) => void;
  info: (msg: string) => void;
  warn: (msg: string) => void;
  error: (msg: string) => void;
  trace: (msg: string) => void;
  debug: (msg: string) => void;
}


interface LogHandler extends EventEmitter {
  on(event: 'log', listener: (msg: any) => void): this
}

export interface ConsoleLogging {
  level?: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';
  metrics?: boolean;
  audit?: boolean;
}

export type Permission = 'read' | '*';


export interface User {
  username: string;
  permissions: Permission;
}
export type Validation = (username: string) => Promise<User>
export type Authentication = (username: string, password: string) => Promise<User>

export interface UserWithPassword extends User {
  password: string;
}
export interface Credentials {
  type: 'credentials';
  users: UserWithPassword[] | Validation;
  authenticate?: Authentication;
  default?: {
    permissions: Permission;
  }
}

export interface UserSettings {
  /**
   * the file used to store the flows. Default: flows_<hostname>.json
   */
  flowFile?: string;
  /**
   * currently only console logging is supported. Various levels of logging can be specified. Options are:
   * fatal - only those errors which make the application unusable should be recorded
   * error - record errors which are deemed fatal for a particular request + fatal errors
   * warn - record problems which are non fatal + errors + fatal errors
   * info - record information about the general running of the application + warn + error + fatal errors
   * debug - record information which is more verbose than info + info + warn + error + fatal errors
   * trace - record very detailed logging + debug + info + warn + error + fatal errors
   * The default level is info. For embedded devices with limited flash storage you may wish to set this to fatal to minimise writes to “disk”.
   */
  logging?: ConsoleLogging;
  /**
   * the root url for the editor UI. If set to false, all admin endpoints are disabled. This includes both API endpoints and the editor UI. To disable just the editor UI, see the disableEditor property below. Default: /
   */
  httpAdminRoot?: string;
  /**
   * the root url for nodes that provide HTTP endpoints. If set to false, all node-based HTTP endpoints are disabled. Default: /
   */
  httpNodeRoot?: string;

  /**
   * the directory to store all user data, such as flow and credential files and all library data. Default: $HOME/.node-red
   */
  userDir?: string;
  /**
   * a directory to search for additional installed nodes. Node-RED searches the nodes directory under the userDir directory. This property allows an additional directory to be searched, so that nodes can be installed outside of the Node-RED install structure. Default: $HOME/.node-red/nodes
   */
  nodesDir?: string;
  coreNodesDir?: string;
  /**
   * if set to true, prevents the editor UI from being served by the runtime. The admin api endpoints remain active. Default: false.
   */
  disableEditor?: boolean;

  /**
   * enables user-level security in the editor and admin API. See security for more information.
   */
  adminAuth?: Credentials;

  /**
   * defines the order of categories in the palette. If a node’s category is not in the list, the category will get added to the end of the palette. If not set, the following default order is used:
   * ['subflows', 'input', 'output', 'function', 'social', 'storage', 'analysis', 'advanced']
   */
  paletteCategories?: string[];

  /**
   * The home path for the Node-RED-Dashboard add-on nodes can specified. This is relative to any already defined httpNodeRoot
   * ui : { path: “mydashboard” }
   */
  ui?: { path: string; }
  /**
   * The theme of the editor can be changed by using the following settings object. All parts are optional.
   */
  editorTheme?: {
    /**
   * Hide the user-menu even if adminAuth is enabled
   */
    userMenu?: boolean;
    page?: {
      title?: string;
      /**
       * absolute path to file
       */
      favicon?: string;
      /**
       * absolute path to file
       */
      css?: string;
    },
    header?: {
      title?: string;
      /**
       * absolute path to file
       */
      image?: string;
      /**
       * optional url to make the header text/image a link to this url
       */
      url?: string;
    },
    deployButton?: {
      type: 'simple';
      label?: string;
      /**
       * absolute path to file
       */
      icon?: string;
    },
    menu?: {
      'menu-item-subflow'?: boolean;
      'menu-item-workspace'?: boolean;
      'menu-item-config-nodes'?: boolean;
      'menu-item-search'?: boolean;
      'menu-item-view-menu'?: boolean;
      'menu-item-user-settings'?: boolean;
      'menu-item-node-red-version'?: boolean;
      'menu-item-import'?: boolean;
      'menu-item-export'?: boolean;
      'menu-item-edit-palette'?: boolean;
      'menu-item-keyboard-shortcuts'?: boolean;
      'menu-item-help'?: boolean | {
        label: string;
        url: string;
      };
    }

    palette?: {
      catalogues?: string[];
      editable?: boolean;
    }

    login?: {
       /**
       * absolute path to file (a 256x256 image)
       */
      image?: string;
    }

  }

  /**
   * Function Nodes - a collection of objects to attach to the global function context. For example,
   * functionGlobalContext: { osModule:require('os') }
   * can be accessed in a function node as:
   * 
   * var myos = global.get('osModule');
   */
  functionGlobalContext?: {};
}
