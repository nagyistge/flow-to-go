module.exports = function (RED: any) {

  function GraphQLSchema(config: any) {
    const { setSchema } = require('../../../../helpers/graphQL');
    RED.nodes.createNode(this, config);
    setSchema(config.schema);
  }
  RED.nodes.registerType('graphql-schema', GraphQLSchema);

  function Resolver(config: any) {
    const { addResolver, removeResolver } = require('../../../../helpers/graphQL');
    RED.nodes.createNode(this, config);
    const node = this;
    node.name = config.name;

    addResolver(node.name, () => new Promise((resolve, reject) => {
      node.send({ resolve, reject });
    }));
    
    node.on('close', () => removeResolver(node.name));
  }

  RED.nodes.registerType('graphql-resolver', Resolver);
};


