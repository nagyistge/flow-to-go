module.exports = function (RED: any) {

  function Initialize(config: any) {
    RED.nodes.createNode(this, config);
    this.filename = config.filename;

    const Datastore = require('nedb');
    const { app } = require("electron");
    const userData = app.getPath('userData');
    const dbName = `${userData}/${this.filename}`;
    this.log(`loading ${dbName}`);
    this.database = new Datastore({ filename: dbName, autoload: true });
  }

  RED.nodes.registerType("storage-file", Initialize);
};