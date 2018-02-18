import * as lodash from 'lodash';
import authentication from './authentication';
import health from './health';
import location from './location';
import user from './user';

import { GraphQLFieldResolver } from 'graphql';
import { IGraphQLContext } from '../router/graphql';

const rawResolvers = lodash.merge(
  authentication,
  health,
  location,
  user,
);

const requiresLogin = {
  Query: {
    me: true,
  },
  Mutation: {
    updateUser: true,
    createLocation: true,
    updateLocation: true,
    deleteLocation: true,
  },
};

const addAuthenticationCheck = topLevel =>
  lodash.mapValues(
    rawResolvers[topLevel],
    (resolver: GraphQLFieldResolver<any, IGraphQLContext, any>, name: string) =>
      (root, args, context, info): GraphQLFieldResolver<any, IGraphQLContext, any> | Promise<string> => {
        if (requiresLogin[topLevel][name] && !context.user) {
          return Promise.reject('AUTHENTICATION_REQUIRED');
        }
        return resolver(root, args, context, info);
      },
  );

const resolvers = {
  ...rawResolvers,
  Query: addAuthenticationCheck('Query'),
  Mutation: addAuthenticationCheck('Mutation'),
};

export default resolvers;
