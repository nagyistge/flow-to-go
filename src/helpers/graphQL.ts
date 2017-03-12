import * as express from 'express';
import { buildSchema, GraphQLSchema } from 'graphql';
import * as graphqlHTTP from 'express-graphql';
import * as fetch from 'isomorphic-fetch';

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

export function fetchData(endpoint: string, graphQLParams: any) {
  console.log(JSON.stringify(graphQLParams));
  return fetch(endpoint, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(graphQLParams),
  }).then((response: any) => response.json());
};

export function addResolver(name:string, resolver: (args:any) => Promise<any>) {
  rootValue[name] = resolver;
}

export function removeResolver(name:string) {
  delete rootValue[name];
}

export function setSchema(newSchema: string) {
  schema = buildSchema(newSchema);
}
