import { CSRF } from '../config';
import { IGraphQLContext } from '../router/graphql';

import { User } from '../forms';

export default {
  Mutation: {
    async accountKitSignup(root, { code, state }, { connectors: { accountKit } }: IGraphQLContext) {
      if (state === CSRF) {
        const { accessToken, account } = await accountKit.call(code);
        const user = await User.signup(accessToken, account);
        return user.apiToken;
      }

      throw new Error('Something went wrong');
    },
  },
};
