import * as uuid from 'uuid/v4';

export const PORT = 3000;

export const FACEBOOK_APP_ID = '308877922948528';
export const FACEBOOK_APP_SECRET = '1ec3b15507392b4e226871cdce727a05';
export const ACCOUNT_KIT_API_VERSION = 'v1.1';

const {
  JWT_SECRET,
  JWT_ISSUER,
} = process.env;

export {
  JWT_SECRET,
  JWT_ISSUER,
};
