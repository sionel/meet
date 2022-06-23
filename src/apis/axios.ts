import { Platform } from 'react-native';
import { Axios, AxiosRequestConfig, AxiosResponse } from 'axios';
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';

import { Auth, ResponseWehagoAPI } from 'src/types/types';
import { getToken, isDev, meetURL, wehagoBaseURL0 } from '.';

class axios extends Axios {
  private auth: undefined | Auth = undefined;

  constructor(auth?: Auth) {
    super();
    this.auth = auth;
  }

  setAuth = (auth: Auth) => {
    this.auth = auth;
  };

  async get<T = any, R = ResponseWehagoAPI<T>, D = any>(
    url: string,
    customConfig: AxiosRequestConfig = {
      data: {},
      headers: { 'Content-Type': 'application/json' }
    }
  ): Promise<R> {
    const [fullUrl, config] = await this._makeConfig(url, customConfig);
    return super.get(fullUrl, config);
  }

  test = () => {
    this.get<{ rkqt: number }>('/test', {
      data: {
        value: 'asd'
      }
    });
  };
  _makeConfig = async (
    url: string,
    config: AxiosRequestConfig
  ): Promise<[string, AxiosRequestConfig]> => {
    let accsessUrl = '';
    let signature = '';
    let headers = {};
    if (this.auth) {
      const { AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY } = this.auth;

      headers = this._createHeader(this.auth, url);
    }
    if (isDev) {
      accsessUrl = `${meetURL}/token`;
    } else {
      accsessUrl = `/video/token`;
      const token = await this._getToken(accsessUrl);
      const encText = accsessUrl + token.cur_date + token.token;
      const hashText = CryptoJS.SHA256(encText);
      signature = CryptoJS.enc.Base64.stringify(hashText);
      accsessUrl = `${wehagoBaseURL0}${accsessUrl}`;
      headers = {
        'Content-Type': 'application/json',
        signature
      };
    }

    return [
      accsessUrl,
      {
        headers,
        data: JSON.stringify(config?.data)
      }
    ];
  };

  _createHeader = (auth: Auth, url: string) => {
    const OSID = Platform.OS === 'ios' ? 'mobile-ios' : 'mobile-android';

    const { AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY } = auth;
    const transactionId = this._getTransactionId();
    const clientId = OSID;
    const service = this._getService(url);
    const timestamp = Math.floor(Date.now() / 1000);
    const wehagoSign = this._getWehagoSign(
      url,
      timestamp,
      transactionId,
      HASH_KEY
    );
    const signature = this._createSignature(String(url) + String(AUTH_A_TOKEN));

    const header = {
      Authorization: `Bearer ${AUTH_A_TOKEN}`,
      'transaction-id': transactionId,
      'wehago-sign': wehagoSign,
      'client-id': clientId,
      'Wehago-S': HASH_KEY,
      timestamp: timestamp,
      signature: signature,
      service: service,
      Cookie: `AUTH_A_TOKEN=${AUTH_A_TOKEN}; AUTH_R_TOKEN=${AUTH_R_TOKEN}`
    };

    return header;
  };

  _serialize = (obj: { [key: string]: string }) => {
    let str = [];
    for (let p in obj)
      if (obj.hasOwnProperty(p)) {
        // str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        str.push(p + '=' + obj[p]);
      }
    return str.join('&');
  };

  _createSignature = (url: string) => {
    return CryptoJS.enc.Base64.stringify(CryptoJS.SHA256(url));
  };

  _getToken = async (accessUrl: string) => {
    try {
      const url = `${wehagoBaseURL0}/get_token/?url=${accessUrl}`;
      const data = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      };

      const response = await super.get(url, data);

      return response.data;
    } catch (err) {
      return false;
    }
  };

  _getTransactionId = () => {
    const randomstring = uuidv4()
      .split('-')
      .reduce((str, value) => str + value, '')
      .substr(0, 10);

    return randomstring;
  };

  _getService = (url: string) => {
    // console.log('_getService : ' + url);
    let service = '';
    if (url.split('/').length > 2) {
      service = url.split('/')[3];
    }
    return service;
  };

  _getWehagoSign = (
    url: string,
    timestamp: number,
    transactionId: string,
    HASH_KEY: string
  ) => {
    const utf8String = CryptoJS.enc.Utf8.parse(HASH_KEY + timestamp).toString();
    const hash_key = CryptoJS.SHA256(utf8String).toString(CryptoJS.enc.Base64);
    const location = this._getLocation(url);
    let wehagoSign;
    if (location) {
      wehagoSign = CryptoJS.enc.Base64.stringify(
        CryptoJS.HmacSHA256(
          location.pathname + location.search + timestamp + transactionId,
          hash_key
        )
      );
    }
    return wehagoSign;
  };

  _getLocation = (url: string) => {
    var match = url.match(
      /^(https?:)\/\/(([^:/?#]*)(?::([0-9]+))?)([/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/
    );
    const ret = match && {
      protocol: match[1],
      host: match[2],
      hostname: match[3],
      port: match[4],
      pathname: match[5],
      search: match[6],
      hash: match[7]
    };
    return ret;
  };

  // getUri(config?: AxiosRequestConfig): string;
  // request<T = any, R = AxiosResponse<T>, D = any>(
  //   config: AxiosRequestConfig<D>
  // ): Promise<R>;
  // get<T = any, R = AxiosResponse<T>, D = any>(
  //   url: string,
  //   config?: AxiosRequestConfig<D>
  // ): Promise<R>;
  // delete<T = any, R = AxiosResponse<T>, D = any>(
  //   url: string,
  //   config?: AxiosRequestConfig<D>
  // ): Promise<R>;
  // head<T = any, R = AxiosResponse<T>, D = any>(
  //   url: string,
  //   config?: AxiosRequestConfig<D>
  // ): Promise<R>;
  // options<T = any, R = AxiosResponse<T>, D = any>(
  //   url: string,
  //   config?: AxiosRequestConfig<D>
  // ): Promise<R>;
  // post<T = any, R = AxiosResponse<T>, D = any>(
  //   url: string,
  //   data?: D,
  //   config?: AxiosRequestConfig<D>
  // ): Promise<R>;
  // put<T = any, R = AxiosResponse<T>, D = any>(
  //   url: string,
  //   data?: D,
  //   config?: AxiosRequestConfig<D>
  // ): Promise<R>;
  // patch<T = any, R = AxiosResponse<T>, D = any>(
  //   url: string,
  //   data?: D,
  //   config?: AxiosRequestConfig<D>
  // ): Promise<R>;
}

export default axios;
