import { Platform } from 'react-native';
import axios, {
  Axios,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosStatic
} from 'axios';
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';

import { Auth, ResponseWehagoAPI } from 'src/types/types';
import { isDev, meetURL, wehagoBaseURL, wehagoBaseURL0 } from '.';

class customAxios {
  private auth: undefined | Auth = undefined;
  private static instance: customAxios;

  constructor(auth?: Auth) {
    if (!customAxios.instance) {
      this.auth = auth;
      customAxios.instance = this;
    }
    return customAxios.instance;
  }

  public static getInstance = () => {
    return customAxios.instance || new customAxios();
  };

  setAuth = (auth: Auth) => {
    this.auth = auth;
  };

  async get<T = any, R = AxiosResponse<ResponseWehagoAPI<T>>, D = any>(
    url: string,
    customConfig: AxiosRequestConfig = {
      data: {},
      headers: { 'Content-Type': 'application/json' }
    }
  ): Promise<R> {
    const [fullUrl, config] = await this._makeConfig(url, customConfig);
    return axios.get(fullUrl, config);
  }

  _makeConfig = async (
    url: string,
    config: AxiosRequestConfig
  ): Promise<[string, AxiosRequestConfig]> => {
    let accsessUrl = '';
    let signature = '';
    let headers = {};
    if (this.auth) {
      headers = this._createHeader(this.auth, url);
    }
    if (isDev) {
      /* 
        개발기의경우 /video로 시작하는 api는
        https://rtctest.wehago.com/api-bind 록 타야하는데 /video 가 없어야 한다
      */
      const isMeetUrl = this._checkMeetUrl(url);
      accsessUrl = `${
        isMeetUrl ? meetURL + url.substring(6) : wehagoBaseURL + url
      }`;
    } else {
      const token = await this._getToken(url);
      const encText = url + token.cur_date + token.token;
      const hashText = CryptoJS.SHA256(encText);
      signature = CryptoJS.enc.Base64.stringify(hashText);
      accsessUrl = `${wehagoBaseURL0}${url}`;
      headers = {
        'Content-Type': config?.headers?.['Content-Type'] ?? 'application/json',
        signature
      };
    }
    return [
      accsessUrl,
      {
        headers,
        data: JSON.stringify(config?.data) ?? ''
      }
    ];
  };

  _checkMeetUrl = (url: string): boolean => {
    return url.split('/')[1] === 'video';
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

      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      };

      const response = await axios.get(url, { headers });
      return response.data;
    } catch (err) {
      console.log(err);
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

  // post<T = any, R = AxiosResponse<T>, D = any>(
  //   url: string,
  //   data?: D,
  //   config?: AxiosRequestConfig<D>
  // ): Promise<R>{
  //  return new Promise<R>
  // }

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

export default customAxios;
