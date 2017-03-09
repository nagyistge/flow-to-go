module.exports = function (RED: any) {

  function GraphQLSchema(config: any) {
    const { setSchema } = require('../../../../helpers/graphQL');
    RED.nodes.createNode(this, config);
    const node = this;
    try {
      setSchema(config.schema);
    } catch (error) {
      node.error(error);
    }
  }
  RED.nodes.registerType('graphql-schema', GraphQLSchema);

  function Resolver(config: any) {
    const { addResolver, removeResolver } = require('../../../../helpers/graphQL');
    RED.nodes.createNode(this, config);
    const node = this;
    node.name = config.name;

    const setStatus = (runningTasks:number) => {
      if (runningTasks > 0) {
        node.status({ fill: 'yellow', shape: 'dot', text: `processing ${runningTasks}` });
      } else {
        node.status({ fill: 'green', shape: 'dot', text: `idle` });
      }
    };

    let runningTasks = 0;
    addResolver(node.name, () => new Promise((resolve, reject) => {
        setStatus(++runningTasks);
        node.send({ resolve, reject });
    }).then(() => setStatus(--runningTasks), () => setStatus(--runningTasks))
    );
    
    node.on('close', () => removeResolver(node.name));
  }

  RED.nodes.registerType('graphql-resolver', Resolver);
};


