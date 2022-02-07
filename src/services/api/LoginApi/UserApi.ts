import * as CryptoJS from 'crypto-js';
import { Platform, Alert, PlatformOSType } from 'react-native';
import fetch from './ApiManager';
import {
  wehagoBaseURL,
  wehagoBaseURL0,
  serialize,
  createHeader
} from '@utils/index';
import { apiAuthInfo } from '../types';
import Axios from '../Axios';
import { isSuccess } from '@services/types';

const getIp = async () => {
  try {
    let login_ip = await fetch('https://api.ipify.org?format=json', {});
    // login_ip = await login_ip.json();
    return login_ip.ip;
  } catch (error) {
    return error;
  }
};

/**
 * getToken
 * @param {String} accessUrl
 */
const getToken = async (accessUrl: string) => {
  try {
    const url = `${wehagoBaseURL0}/get_token/?url=${accessUrl}`;
    const data = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    };
    const response = await fetch(url, data);
    return response;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const getRK = async (userPw: string): Promise<any> => {
  try {
    const date = new Date().getTime();
    const url = `/auth/login/rk/?rand=${date}`;
    const getTokenResult = await getToken(url);
    const encText = url + getTokenResult.cur_date + getTokenResult.token;
    // NOTE 토큰 -> SHA256 -> Base64 String
    const hashText = CryptoJS.SHA256(encText);
    const signature = CryptoJS.enc.Base64.stringify(hashText);
    const data = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        signature
      }
    };
    const response = await fetch(`${wehagoBaseURL0}${url}`, data);

    const key = response.resultData.random_key;

    const encPw = CryptoJS.AES.encrypt(userPw, CryptoJS.enc.Utf8.parse(key), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }).toString();
    const obj = {
      encPw,
      key
    };
    return encPw.includes('+') ? getRK(userPw) : obj;
  } catch (err) {
    return false;
  }
};

/**
 * loginRequest
 * wehago 토큰을 생성
 * @param userId
 * @param userPw
 */
const loginRequest = async (
  userId: string,
  userPw: string,
  service_code: 'wehagomeet' | 'meet',
  captcha = false,
  access_pass: string | null
) => {
  const { encPw, key } = await getRK(userPw);
  const date = new Date().getTime(); // January 1, 1970 로 부터의 시간 (밀리초)
  const url = captcha
    ? '/auth/login/exceed'
    : `/auth/login/mobile?timestamp=${date}`;
  const getTokenResult = await getToken(url);
  const encText = url + getTokenResult.cur_date + getTokenResult.token;
  // NOTE 토큰 -> SHA256 -> Base64 String
  const hashText = CryptoJS.SHA256(encText);
  const signature = CryptoJS.enc.Base64.stringify(hashText);
  const data = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      signature: signature
    },
    body: serialize({
      access_type: service_code,
      access_pass: access_pass,
      random_key: key,
      portal_id: userId,
      portal_password: encPw,
      login_os: Platform.OS,
      login_device: Platform.OS,
      login_ip: await getIp(),
      login_browser: 'WEHAGO-APP',
      login_type: 'MOBILE'
    })
  };

  const response = await Axios(`${wehagoBaseURL0}${url}`, data);
  if (isSuccess(response)) {
    return response;
  } else {
    return response;
  }
};

const serviceDeployCheck = async (auth: apiAuthInfo, cno: string) => {
  const { AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY } = auth;

  try {
    const url = `${wehagoBaseURL}/common/layout/service/deployed/to-company-user?cno=${cno}`;
    const headers = createHeader({ AUTH_A_TOKEN, AUTH_R_TOKEN, url, HASH_KEY });
    const data = {
      method: 'GET',
      headers: {
        ...headers,
        'content-type': 'application/x-www-form-urlencoded'
      }
    };

    const response = await fetch(url, data);
    if (response.resultCode === 200) return response.resultData;
    else return false;
  } catch (err) {
    console.warn('serviceDeployCheck', err);
    return false;
  }
};

export default {
  loginRequest,
  serviceDeployCheck
};
