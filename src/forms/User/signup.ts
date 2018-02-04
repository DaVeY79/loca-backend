import { v4 as uuid } from 'uuid';
import { IAccountKitAccessToken, IAccountKitAccount } from '../../connectors/AccountKit';
import { User } from '../../entities';

export const signup = (accessToken: IAccountKitAccessToken, account: IAccountKitAccount): Promise<User> => {
  const user = new User();
  user.accountKitID = account.id;
  user.accountKitAccessToken = accessToken.access_token;
  user.phoneCountryCode = account.phone.country_prefix;
  user.phoneNumber = account.phone.national_number;
  user.apiToken = uuid();
  return user.save();
};
