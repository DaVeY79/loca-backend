import * as lodash from 'lodash';
import { v4 as uuid } from 'uuid';

import { IAccountKitAccessToken, IAccountKitAccount } from '../connectors/AccountKit';
import { IGraphQLContext } from '../router/graphql';
import { LocaGQL } from '../schema/types';

import { User } from '../entities';

export default {
  Mutation: {
    async accountKitSignup(
      root,
      { input }: { input: LocaGQL.IAccountKitSignupInput },
      { connectors: { accountKit } }: IGraphQLContext,
    ): Promise<{ user: User, apiToken: string }> {
      const { accessToken, account } = await accountKit.call(input.code);

      const existingUser =
        await User.createQueryBuilder('u')
                  .where('u.accountKitID = :accountKitID')
                  .orWhere('u.phoneCountryCode = :phoneCountryCode AND u.phoneNumber = :phoneNumber')
                  .setParameters({
                    accountKitID: account.id,
                    phoneCountryCode: account.phone.country_prefix,
                    phoneNumber: account.phone.national_number,
                  })
                  .getOne();

      const user = lodash.isUndefined(existingUser) ? new User() : existingUser;
      user.accountKitID = account.id;
      user.accountKitAccessToken = accessToken.access_token;
      user.phoneCountryCode = account.phone.country_prefix;
      user.phoneNumber = account.phone.national_number;
      user.username = account.phone.number;
      user.apiToken = uuid();

      return { user: await user.save(), apiToken: user.apiToken };
    },
  },
};
