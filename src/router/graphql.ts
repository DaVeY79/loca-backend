import express from 'express';
import bodyParser from 'body-parser';

import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';

import { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, ACCOUNT_KIT_API_VERSION } from '../config';

import typeDefs from '../schema';
import resolvers from '../resolvers';
import * as connectors from '../connectors';

const router = express.Router();

const schema = makeExecutableSchema({ typeDefs, resolvers });

addMockFunctionsToSchema({ schema, preserveResolvers: true });

router.use('/graphql', bodyParser.json(), graphqlExpress(() => ({
  schema,
  context: {
    accountKit: new connectors.AccountKit({
      appId: FACEBOOK_APP_ID,
      appSecret: FACEBOOK_APP_SECRET,
      apiVersion: ACCOUNT_KIT_API_VERSION,
    }),
  },
})));

router.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

export default router;
