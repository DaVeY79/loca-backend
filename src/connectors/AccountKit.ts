import crypto from 'crypto';
import requestPromiseNative from 'request-promise-native';
import url from 'url';

export default class AccountKitConnector {
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

  public async call(code) {
    const { access_token: clientAccessToken } = await this.tokenExchange(code);
    return this.me(clientAccessToken);
  }

  get accessToken(): string {
    return ['AA', this.appId, this.appSecret].join('|');
  }

  private tokenExchange(code): Promise<any> {
    return requestPromiseNative.get({
      url: this.buildURL(AccountKitConnector.baseTokenExchangeURL),
      qs: {
        code,
        access_token: this.accessToken,
        grant_type: 'authorization_code',
      },
      json: true,
    });
  }

  private me(clientAccessToken): Promise<any> {
    return requestPromiseNative.get({
      url: this.buildURL(AccountKitConnector.baseMeURL),
      qs: {
        access_token: clientAccessToken,
        appsecret_proof: this.appSecretProof(clientAccessToken),
      },
      json: true,
    });
  }

  private buildURL(endpoint): string {
    return url.resolve(`${AccountKitConnector.baseURL}/${this.apiVersion}`, endpoint);
  }

  private appSecretProof(clientAccessToken): string {
    return crypto.createHmac('sha256', this.appSecret).update(clientAccessToken).digest('hex');
  }
}
