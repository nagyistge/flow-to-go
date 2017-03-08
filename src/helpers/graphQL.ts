import * as express from 'express';
import { buildSchema, GraphQLSchema } from 'graphql';
import * as graphqlHTTP from 'express-graphql';

let schema: GraphQLSchema = null;
let rootValue: Object = null;

function getHttpOptions(req: express.Request) {
  return {
    schema: schema,
    graphiql: false,
    rootValue: rootValue
  };
}

export function getHttpMiddleware() {
  return graphqlHTTP(getHttpOptions);
}

export function setRootValue(newValue: Object) {
  rootValue = newValue;
}

export function setSchema(newSchema: string) {
  schema = buildSchema(newSchema);
}
