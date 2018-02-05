import * as lodash from 'lodash';
import authentication from './authentication';
import health from './health';
import user from './user';

import { GraphQLFieldResolver } from 'graphql';
import { IGraphQLContext } from '../router/graphql';

const rawResolvers = lodash.merge(
  health,
  authentication,
  user,
);

const requiresLogin = {
  Query: {
    me: true,
  },
};

const resolvers = {
  ...rawResolvers,
  Query: lodash.mapValues(
    rawResolvers.Query,
    (resolver: GraphQLFieldResolver<any, IGraphQLContext, any>, name: string) =>
      (root, args, context, info): GraphQLFieldResolver<any, IGraphQLContext, any> | Promise<string> => {
        if (requiresLogin.Query[name] && !context.user) {
          return Promise.reject('Authentication required');
        }
        return resolver(root, args, context, info);
      },
  ),
};

export default resolvers;
