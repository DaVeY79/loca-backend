import url from 'url';
import rp from 'request-promise-native';
import crypto from 'crypto';

export default class AccountKitConnector {
  appId: string
  appSecret: string
  apiVersion: string

  static baseURL: string = 'https://graph.accountkit.com'
  static baseTokenExchangeURL: string = '/access_token'
  static baseMeURL: string = '/me'

  constructor({ appId, appSecret, apiVersion }) {
    this.appId = appId;
    this.appSecret = appSecret;
    this.apiVersion = apiVersion;
  }

  async call(code) {
    // id, token_refresh_interval_sec n_
    const { access_token: clientAccessToken } = await this.tokenExchange(code);
    return this.me(clientAccessToken);
  }

  get accessToken(): string {
    return ['AA', this.appId, this.appSecret].join('|');
  }

  tokenExchange(code): Promise<any> {
    return rp.get({
      url: this.buildURL(AccountKitConnector.baseTokenExchangeURL),
      json: true,
      qs: {
        grant_type: 'authorization_code',
        code,
        access_token: this.accessToken,
      },
    });
  }

  me(clientAccessToken): Promise<any> {
    return rp.get({
      url: this.buildURL(AccountKitConnector.baseMeURL),
      json: true,
      qs: {
        access_token: clientAccessToken,
        appsecret_proof: this.appSecretProof(clientAccessToken),
      },
    });
  }

  buildURL(endpoint): string {
    return url.resolve(`${AccountKitConnector.baseURL}/${this.apiVersion}`, endpoint);
  }

  appSecretProof(clientAccessToken): string {
    return crypto.createHmac('sha256', this.appSecret).update(clientAccessToken).digest('hex');
  }
}
