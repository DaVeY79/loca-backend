import * as lodash from 'lodash';
import authentication from './authentication';
import health from './health';
import user from './user';

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
    (resolver, name) =>
      (root, args, context, info) => {
        if (requiresLogin.Query[name] && !context.user) {
          return Promise.reject('Authentication required');
        }
        return resolver(root, args, context, info);
      },
  ),
};

export default resolvers;
