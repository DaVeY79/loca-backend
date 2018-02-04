import { User } from '../entities';
import { IGraphQLContext } from '../router/graphql';

export default {
  User: {
    phoneNumber: (user: User) => `+${user.phoneCountryCode} ${user.phoneNumber}`,
  },
  Query: {
    me: (root, params, context) => context.user,
  },
};
