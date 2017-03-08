module.exports = function (RED: any) {

  function GraphQLSchema(config: any) {
    const { setSchema } = require('../../../../helpers/graphQL');
    RED.nodes.createNode(this, config);
    setSchema(config.schema);
  }
  RED.nodes.registerType('graphql-schema', GraphQLSchema);

  function Resolver(config: any) {
    RED.nodes.createNode(this, config);
    const node = this;
    node.schema = RED.nodes.getNode(config.schema).schema;
  }
  RED.nodes.registerType('graphql-resolver', Resolver);
};


