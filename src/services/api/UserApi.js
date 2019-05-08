/**
 * User API
 * 사용자 관련 API
 */

import {
  wehagoBaseURL,
  wehagoBaseURL0,
  securityRequest,
  _createSignature
} from '../../utils';
const tempBaseUrl = `https://jsonplaceholder.typicode.com`;
import { UserApi } from '../index';
import CryptoJS from 'crypto-js';

// #region
export default {
  /**
   * TEST
   * 테스트 api
   */
  test: () =>
    fetch(`${tempBaseUrl}/posts`)
      .then(response => response.json())
      .then(responseJson => responseJson)
      .catch(err => {
        console.log('login err: ', err);
      }),

  /**
   *
   */
  getToken: async accessUrl => {
    try {
      const url = `${wehagoBaseURL0}/get_token/?url=${accessUrl}`;
      const data = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      };
      const response = await fetch(url, data);
      const responseJson = await response.json();
      // console.log('responseJson : ', responseJson);

      return responseJson;
    } catch (err) {
      return false;
    }
  },

  /**
   * Login
   * --
   * JSON형태로 데이터를 전송할수없음 => urlencoded방식으로 전달
   */
  login: async user => {
    // console.log('DATA : ', user);

    // alert(data.portal_id);
    // const url = `${wehagoBaseURL}/auth/login/mobile?timestamp=`;
    try {
      // const body = {
      //   portal_id: data.portal_id,
      //   portal_password: data.portal_password,
      //   // 기기정보
      //   login_ip: data.login_ip,
      //   login_device: data.login_device,
      //   login_os: data.login_os,
      //   login_browser: data.login_browser
      // };
      const date = new Date().getTime();
      const url = `/auth/login/mobile?timestamp=${date}`;
      const getTokenResult = await UserApi.getToken(`${url}`);
      const encText = url + getTokenResult.cur_date + getTokenResult.token;
      const hashText = CryptoJS.SHA256(encText);
      const aaa = CryptoJS.enc.Base64.stringify(hashText);

      const data = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          signature: aaa
          // signature: aaa
        },
        body: new URLSearchParams({
          // portal_id: 'seongh7800',
          // portal_password: 'kseongh0080',
          // login_ip: 'localhost',
          // login_device: 'iPhone',
          // login_os: '12.1',
          // login_browser: 'WEHAGO-APP'
          portal_id: user.portal_id,
          portal_password: user.portal_password,
          login_ip: user.login_ip,
          login_os: user.login_os,
          login_device: user.login_device,
          login_browser: user.login_browser
        }).toString()
      };

      const response = await fetch(`${wehagoBaseURL0}${url}`, data);
      const responseJson = await response.json();
      // console.log('responseJson : ', responseJson);

      return responseJson;
    } catch (err) {
      console.log('err : ', err);

      return false;
    }
  },

  /**
   * check
   * 로그인 및 사용자 정보 확인 - 토큰만료 또는 정보변경시 자동로그인
   */
  check: async (a_token, r_token, cno, HASH_KEY) => {
    try {
      const url = `${wehagoBaseURL}/common/user/userinfo/detail?cno=${cno}`;
      const headers = securityRequest(a_token, r_token, url, HASH_KEY);
      const response = await fetch(url, {
        method: 'GET',
        headers
      });
      const responseJson = await response.json();
      // console.log('CHECK API : ', responseJson);

      return responseJson;
    } catch (err) {
      return err;
    }
  }
};
// #endregion
