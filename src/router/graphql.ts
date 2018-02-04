import { createConnection } from 'typeorm';
import { Connection } from 'typeorm/connection/Connection';

import * as bodyParser from 'body-parser';
import { Router } from 'express';

import { graphiqlExpress, graphqlExpress } from 'apollo-server-express';
import { addMockFunctionsToSchema, makeExecutableSchema } from 'graphql-tools';

import { ACCOUNT_KIT_API_VERSION, FACEBOOK_APP_ID, FACEBOOK_APP_SECRET } from '../config';

import { AccountKit } from '../connectors';
import { User } from '../entities';
import resolvers from '../resolvers';
import schema from '../schema';

const router = Router();

const executableSchema = makeExecutableSchema({ resolvers, typeDefs: schema });

addMockFunctionsToSchema({ schema: executableSchema, preserveResolvers: true });

export interface IGraphQLContext {
  connectors: {
    accountKit: AccountKit,
  };
}

const connection = createConnection();

const tokenExtractor = /bearer (.*)/;

const getUser = async (authorization) => {
  if (!authorization) {
    return null;
  }
  const match = authorization.toLowerCase().match(tokenExtractor);
  if (match) {
    return User.findOne({ apiToken: match[1] });
  }
  return null;
};

router.use('/graphql', bodyParser.json(), graphqlExpress(async req => ({
  context: {
    user: await getUser(req.headers.authorization),
    connection: await connection,
    connectors: {
      accountKit: new AccountKit({
        apiVersion: ACCOUNT_KIT_API_VERSION,
        appId: FACEBOOK_APP_ID,
        appSecret: FACEBOOK_APP_SECRET,
      }),
    },
  },
  schema: executableSchema,
})));

router.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

export default router;
