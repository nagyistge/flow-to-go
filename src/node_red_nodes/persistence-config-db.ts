module.exports = function (RED: any) {
  
  function Initialize(config: any) {
    RED.nodes.createNode(this, config);
    this.name = config.name;

    // const Datastore = require('nedb');
    // const { app } = require("electron");
    // const userData = app.getPath('userData');
    
    // this.database = new Datastore({ filename: `${userData}/${this.name}`, autoload: true });

  }
  RED.nodes.registerType("persistence-config-db", Initialize);
};