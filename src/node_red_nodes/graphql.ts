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
    addResolver(node.name, (args:any) => new Promise((resolve, reject) => {
      setStatus(++runningTasks);
        // @if DEBUG
        console.info(`{node.name}: (${JSON.stringify(args)}) => ?`);
        // @endif
        node.send({ resolve, reject, args });
    }).then((result) => {
        setStatus(--runningTasks);
        return result;
      }
      , (reason) => {
        setStatus(--runningTasks);
        return Promise.reject(reason);
      })
    );
    
    node.on('close', () => removeResolver(node.name));
  }

  RED.nodes.registerType('graphql-resolver', Resolver);

  // result
  function GraphQLResolve(config: any) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.on('input', (msg: { resolve: (result: any) => void, payload: any }) => {
      // @if DEBUG
      console.info(`resolve => (${JSON.stringify(msg.payload)})`);
      // @endif
      msg.resolve(msg.payload);
    });
  }
  RED.nodes.registerType('graphql-resolve', GraphQLResolve);

  // reject
  function GraphQLReject(config: any) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.on('input', (msg: { reject: (reason: string) => void, payload: any }) => {
      // @if DEBUG
      console.info(`reject => (${JSON.stringify(msg.payload)})`);
      // @endif
      msg.reject(msg.payload);
    });
  }
  RED.nodes.registerType('graphql-reject', GraphQLReject);

};


