module.exports = function (RED: any) {
  function Insert(node: any, db: any, msg: any) {
    const data = msg.payload;
    if (!data) { return; }

    db.insert(data, function (error: Error, newData: any) {
      if (error) {
        node.error(error, msg);
      } else {
        msg.payload = newData;
        node.send(msg);
      }
    });
  }

  function Remove(node: any, db: any, query: any, msg: any) {
    if (!query) {
      node.error('No Query defined.', msg);
    } else {
      db.remove(query, { multi: true }, function (error: Error, numRemoved: number) {
        if (error) {
          node.error(error, msg);
        } else {
          msg.payload = numRemoved;
          node.send(msg);
        }
      });
    }
  }

    function Update(node: any, db: any, query: any, update: any, options: any, msg: any) {
    if (!query) {
      node.error('No Query defined.', msg);
      return;
    }

    if (!update) {
      node.error('No Update defined.', msg);
      return;
    }
    
    const callback = function (error: Error, numReplaced: number) {
      if (error) {
        node.error(error, msg);
      } else {
        msg.payload = numReplaced;
        node.send(msg);
      };
    };

    if (options) { db.update(query, update, options, callback); }
    else { db.update(query, update, callback); }
  }

  function Find(node: any, db: any, method: string, query: any, sort: any, skip: any, limit: any, msg: any) {
    if (!query) {
      node.error('No Query defined.', msg);
    } else {
      let cursor = db.find(query);
      cursor = sort ? cursor.sort(sort) : cursor;
      cursor = skip ? cursor.skip(skip) : cursor;
      cursor = limit ? cursor.limit(limit) : cursor;
      cursor.exec(function (error: Error, docs: any) {
        if (error) {
          node.error(error, msg);
        } else {
          msg.payload = docs;
          node.send(msg);
        }
      });
    }
  }

  function Count(node: any, db: any, method: string, query: any, skip: any, limit: any, msg: any) {
    if (!query) {
      node.error('No Query defined.', msg);
    } else {
      let cursor = db.count(query);
      cursor = skip ? cursor.skip(skip) : cursor;
      cursor = limit ? cursor.limit(limit) : cursor;
      cursor.exec(function (error: Error, docs: any) {
        if (error) {
          node.error(error, msg);
        } else {
          msg.payload = docs;
          node.send(msg);
        }
      });
    }
  }
 
  // Storage-Node
  function Storage(config: any) {
    RED.nodes.createNode(this, config);
    const node = this;
    const db = RED.nodes.getNode(config.database).database;

    const getQuery = config.query ? () => JSON.parse(config.query) : (msg: any) => msg.query;
    const getSort = config.sort ? () => JSON.parse(config.sort) : (msg: any) => msg.sort;
    const getSkip = config.skip ? () => config.skip : (msg: any) => msg.skip;
    const getLimit = config.limit ? () => config.limit : (msg: any) => msg.limit;
    const getUpdate = config.update ? () => JSON.parse(config.update) : (msg: any) => msg.update;
    const getOptions = config.options ? () => JSON.parse(config.options) : (msg: any) => msg.options;

    node.on('input', function (msg: any) {
      switch (config.method) {
        case 'remove':
          Remove(node, db, getQuery(msg), msg);
          break;
        case 'update':
          Update(node, db, getQuery(msg), getUpdate(msg), getOptions(msg), msg);
          break;
        case 'find':
          Find(node, db, config.method, getQuery(msg), getSort(msg), getSkip(msg), getLimit(msg), msg);
          break;
        case 'count':
          Count(node, db, config.method, getQuery(msg), getSkip(msg), getLimit(msg), msg);
          break;
        case 'insert':
          Insert(node, db, msg);
          break;
        default:
          node.error(`unknown method ${config.method}`, msg);
      }
    });
  }

  RED.nodes.registerType("storage", Storage);

  // Configuration-Node
  function StorageFile(config: any) {
    RED.nodes.createNode(this, config);
    const node = this;
    const Datastore = require('nedb');

    if (config.filename === '') {
      node.log(`in-memory`);
      node.database = new Datastore();
    } else {
      node.filename = config.filename;
      const { app } = require("electron");
      const userData = app.getPath('userData');
      const dbName = `${userData}/${this.filename}`;
      node.log(`Filename: ${dbName}`);
      node.database = new Datastore({ filename: dbName, autoload: true });
    }
  }
  RED.nodes.registerType("storage-file", StorageFile);

};