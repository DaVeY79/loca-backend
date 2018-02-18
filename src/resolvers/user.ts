import { User } from '../entities';
import { IGraphQLContext } from '../router/graphql';
import { LocaGQL } from '../schema/types';

import { QueryFailedError } from 'typeorm';

export default {
  User: {
    phoneNumber: (user: User) => `+${user.phoneCountryCode} ${user.phoneNumber}`,
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

      try {
        return { user: await user.save() };
      } catch (error) {
        if (error instanceof QueryFailedError && (error as any).constraint === 'unique_index_user_on_username') {
          throw new Error('Sorry, that username is taken');
        }
        throw error;
      }
    },
  },
};
