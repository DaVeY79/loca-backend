import * as bodyParser from 'body-parser';
import { Router } from 'express';

import { graphiqlExpress, graphqlExpress } from 'apollo-server-express';
import { addMockFunctionsToSchema, makeExecutableSchema } from 'graphql-tools';

import { ACCOUNT_KIT_API_VERSION, FACEBOOK_APP_ID, FACEBOOK_APP_SECRET } from '../config';

import * as connectors from '../connectors';
import resolvers from '../resolvers';
import schema from '../schema';

const router = Router();

const executableSchema = makeExecutableSchema({ resolvers, typeDefs: schema });

addMockFunctionsToSchema({ schema: executableSchema, preserveResolvers: true });

router.use('/graphql', bodyParser.json(), graphqlExpress(() => ({
  context: {
    accountKit: new connectors.AccountKit({
      apiVersion: ACCOUNT_KIT_API_VERSION,
      appId: FACEBOOK_APP_ID,
      appSecret: FACEBOOK_APP_SECRET,
    }),
  },
  schema: executableSchema,
})));

router.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

export default router;
