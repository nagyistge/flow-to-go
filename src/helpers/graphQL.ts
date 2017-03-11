import * as express from 'express';
import { buildSchema, GraphQLSchema } from 'graphql';
import * as graphqlHTTP from 'express-graphql';

let schema: GraphQLSchema = null;
const rootValue: any = {};

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

export function addResolver(name:string, resolver: (args:any) => Promise<any>) {
  rootValue[name] = resolver;
}

export function removeResolver(name:string) {
  delete rootValue[name];
}

export function setSchema(newSchema: string) {
  schema = buildSchema(newSchema);
}
