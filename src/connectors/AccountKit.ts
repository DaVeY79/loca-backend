import * as crypto from 'crypto';
import { ServerResponse } from 'http';
import { get, RequestPromise } from 'request-promise-native';
import * as url from 'url';

export interface IAccountKitAccessToken {
  readonly id: number;
  readonly access_token: string;
  readonly token_refresh_interval_sec: number;
}

export interface IAccountKitAccount {
  readonly id: string;
  readonly phone: {
    readonly number: string,
    readonly country_prefix: string,
    readonly national_number: string,
  };
  readonly application: {
    readonly id: string,
  };
}

export class AccountKit {
  private static baseURL: string = 'https://graph.accountkit.com';
  private static baseTokenExchangeURL: string = '/access_token';
  private static baseMeURL: string = '/me';

  public appId: string;
  public appSecret: string;
  public apiVersion: string;

  constructor({ appId, appSecret, apiVersion }) {
    this.appId = appId;
    this.appSecret = appSecret;
    this.apiVersion = apiVersion;
  }

  public async call(code: string): Promise<{
    accessToken: IAccountKitAccessToken,
    account: IAccountKitAccount,
  }> {
    try {
      const accessToken: IAccountKitAccessToken  = await this.tokenExchange(code);
      const account: IAccountKitAccount = await this.me(accessToken.access_token);

      return { accessToken, account };
    } catch (response) {
      throw new Error('Error retrieving AccountKit details. Please try again.');
    }
  }

  get accessToken(): string {
    return ['AA', this.appId, this.appSecret].join('|');
  }

  private tokenExchange(code): RequestPromise {
    return get({
      url: this.buildURL(AccountKit.baseTokenExchangeURL),
      qs: {
        code,
        access_token: this.accessToken,
        grant_type: 'authorization_code',
      },
      json: true,
    });
  }

  private me(clientAccessToken): RequestPromise {
    return get({
      url: this.buildURL(AccountKit.baseMeURL),
      qs: {
        access_token: clientAccessToken,
        appsecret_proof: this.appSecretProof(clientAccessToken),
      },
      json: true,
    });
  }

  private buildURL(endpoint): string {
    return url.resolve(`${AccountKit.baseURL}/${this.apiVersion}`, endpoint);
  }

  private appSecretProof(clientAccessToken): string {
    return crypto.createHmac('sha256', this.appSecret).update(clientAccessToken).digest('hex');
  }
}
