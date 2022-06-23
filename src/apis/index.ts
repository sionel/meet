import { Platform } from 'react-native';
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';

import { Auth } from '../types/types';
import axios from 'axios';

export { default as videoApi } from './video';

const OS = Platform.OS;
const OSID = OS === 'ios' ? 'mobile-ios' : 'mobile-android';

// 개발기,운영기 로 바꾸려면 해당 주석을 이용하자
// export const isDev = true;
export const isDev = false;

export const wehagoBaseURL0 = isDev
  ? `http://dev.api0.wehago.com`
  : `https://api0.wehago.com`;
export const wehagoBaseURL = isDev
  ? `http://dev.api.wehago.com`
  : `https://api.wehago.com`;
export const wehagoMainURL = isDev
  ? `http://dev.wehago.com`
  : `https://www.wehago.com`;

export const meetURL = isDev
  ? `https://rtctest.wehago.com/api-bind`
  : `https://api.wehago.com/video`;
// export const meetURL = `http://localhost:8080/videodev`;

export const wehagoDummyImageURL = `https://static.wehago.com/imgs/dummy/@dummy_02.jpg`; // 더미 프로필
export const wehagoStaticURL = `https://static.wehago.com`;

export const serialize = (obj: { [key: string]: string }) => {
  let str = [];
  for (let p in obj)
    if (obj.hasOwnProperty(p)) {
      // str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      str.push(p + '=' + obj[p]);
    }
  return str.join('&');
};

export const createSignature = (url: string) => {
  return CryptoJS.enc.Base64.stringify(CryptoJS.SHA256(url));
};

export const createHeader = (auth: Auth) => {
  const { AUTH_A_TOKEN, AUTH_R_TOKEN, url, HASH_KEY } = auth;
  const transactionId = _getTransactionId();
  const clientId = OSID;
  const service = _getService(url);
  const timestamp = Math.floor(Date.now() / 1000);
  const wehagoSign = _getWehagoSign(url, timestamp, transactionId, HASH_KEY);
  const signature = createSignature(String(url) + String(AUTH_A_TOKEN));

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

export const getToken = async (accessUrl: string) => {
  try {
    const url = `${wehagoBaseURL0}/get_token/?url=${accessUrl}`;
    const data = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    };

    const response = await fetch(url, data);

    return response.json();
  } catch (err) {
    return false;
  }
};

const _getTransactionId = () => {
  const randomstring = uuidv4()
    .split('-')
    .reduce((str, value) => str + value, '')
    .substr(0, 10);

  return randomstring;
};

const _getService = (url: string) => {
  // console.log('_getService : ' + url);
  let service = '';
  if (url.split('/').length > 2) {
    service = url.split('/')[3];
  }
  return service;
};

const _getWehagoSign = (
  url: string,
  timestamp: number,
  transactionId: string,
  HASH_KEY: string
) => {
  const utf8String = CryptoJS.enc.Utf8.parse(HASH_KEY + timestamp).toString();
  const hash_key = CryptoJS.SHA256(utf8String).toString(CryptoJS.enc.Base64);
  const location = _getLocation(url);
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

const _getLocation = (url: string) => {
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
