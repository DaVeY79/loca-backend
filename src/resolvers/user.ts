import { Location, LocationAuthorizationStatus, User } from '../entities';
import { IGraphQLContext } from '../router/graphql';
import { LocaGQL } from '../schema/types';

import { QueryFailedError } from 'typeorm';

const executeIfFunction = input => typeof input === 'function' ? input() : input;
const ensurePrivacy = (user: User, contextUser: User, result: any, error: any): typeof result | typeof error => (
  executeIfFunction(user === contextUser ? result : error)
);

export default {
  User: {
    email: (user: User, args, context: IGraphQLContext) =>
      ensurePrivacy(user, context.user, user.email, 'private'),
    phoneNumber: (user: User, args, context: IGraphQLContext) =>
      ensurePrivacy(user, context.user, `+${user.phoneCountryCode} ${user.phoneNumber}`, 'private'),
    locations: (user: User, args, context: IGraphQLContext) =>
      ensurePrivacy(user, context.user, () => Location.find({ where: { user } }), []),
  },
  Query: {
    me: (root, params, context) => context.user,
  },
  Mutation: {
    async updateUser(
      root,
      { input }: { input: LocaGQL.IUpdateLocationInput },
      context: IGraphQLContext,
    ): Promise<{ user: User }> {
      const user = context.user;

      ['name', 'username', 'email'].forEach((column) => {
        if (input[column]) {
          user[column] = input[column];
        }
      });

      return { user: await user.validateAndSave() };
    },
  },
};
