module.exports = function (RED: any) {
  function Initialize(config: any) {
    RED.nodes.createNode(this, config);
    this.database = RED.nodes.getNode(config.database);
  }
  RED.nodes.registerType("persistence-db", Initialize);
};