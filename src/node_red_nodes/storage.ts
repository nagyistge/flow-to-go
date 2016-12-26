module.exports = function (RED: any) {
  
  // Input
 
  function StorageIn(config: any) {
    RED.nodes.createNode(this, config);
    const node = this;
    const db = RED.nodes.getNode(config.database);

    node.on('input', function (msg: any) {
      const data = <Object[]>msg.payload.data;
      if (!data) return;

      db.insert(data, function (error: Error, data:any) {
        if (error) {
          node.error(error);
          return;
        }
        if (data) node.send({ payload: { data } });
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