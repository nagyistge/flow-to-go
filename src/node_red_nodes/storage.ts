module.exports = function (RED: any) {
  
  // Input
 
  function StorageIn(config: any) {
    RED.nodes.createNode(this, config);
    this.database = RED.nodes.getNode(config.database);
  }

  RED.nodes.registerType("storage-in", StorageIn);

  // Configuration

  function StorageFile(config: any) {
    RED.nodes.createNode(this, config);
    this.filename = config.filename;

    const Datastore = require('nedb');
    const { app } = require("electron");
    const userData = app.getPath('userData');
    const dbName = `${userData}/${this.filename}`;
    this.log(`loading ${dbName}`);
    this.database = new Datastore({ filename: dbName, autoload: true });
  }

  RED.nodes.registerType("storage-file", StorageFile);

};