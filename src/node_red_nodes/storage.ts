module.exports = function (RED: any) {
  
  // Input
 
  function StorageIn(config: any) {
    RED.nodes.createNode(this, config);
    const node = this;
    const configNode = RED.nodes.getNode(config.database);
    const db = configNode.database;

    node.on('input', function (msg: any) {
      const data = msg.payload;
      if (!data) return;

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

  RED.nodes.registerType("storage-in", StorageIn);

  // Configuration

  function StorageFile(config: any) {
    RED.nodes.createNode(this, config);
    const node = this;
    node.filename = config.filename;

    const Datastore = require('nedb');
    const { app } = require("electron");
    const userData = app.getPath('userData');
    const dbName = `${userData}/${this.filename}`;
    node.log(`loading ${dbName}`);
    node.database = new Datastore({ filename: dbName, autoload: true });
  }

  RED.nodes.registerType("storage-file", StorageFile);

};