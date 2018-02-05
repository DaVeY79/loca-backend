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
    ): Promise<LocaGQL.IAccountKitSignupOutput> {
      const { accessToken, account } = await accountKit.call(input.code);

      const user = new User();
      user.accountKitID = account.id;
      user.accountKitAccessToken = accessToken.access_token;
      user.phoneCountryCode = account.phone.country_prefix;
      user.phoneNumber = account.phone.national_number;
      user.apiToken = uuid();

      return { user, apiToken: user.apiToken };
    },
  },
};
