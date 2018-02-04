import { CSRF } from '../config';

export default {
  Mutation: {
    async accountKitSignup(root, { code, state }, { accountKit }) {
      if (state === CSRF) {
        const { phone: { number } } = await accountKit.call(code);
        return { phoneNumber: number };
      }
      
      throw new Error('Something went wrong');
    },
  },
};
