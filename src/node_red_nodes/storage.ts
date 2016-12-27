module.exports = function (RED: any) {
  
  // Input
 
  function StorageIn(config: any) {
    RED.nodes.createNode(this, config);
    const node = this;
    const configNode = RED.nodes.getNode(config.database);
    const db = configNode.database;

    node.on('input', function (msg: any) {
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
    });
  }
  RED.nodes.registerType("storage-insert", StorageIn);

  // Query
 
  function StorageQuery(config: any) {
    RED.nodes.createNode(this, config);
    const node = this;
    const db = RED.nodes.getNode(config.database).database;

    node.on('input', function (msg: any) {
      const query = config.query ? JSON.parse(config.query) : msg.query;
      if (!query) {
        node.error('No Query defined.', msg);
      } else {
        let cursor = db[config.method](query);
        cursor = config.limit ? cursor.limit(config.limit) : cursor;
        cursor.exec(function (error: Error, docs: any) {
          if (error) {
            node.error(error, msg);
          } else {
            msg.payload = docs;
            node.send(msg);
          }
        });
      }
    });
  }
  RED.nodes.registerType("storage-query", StorageQuery);

  // Configuration

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