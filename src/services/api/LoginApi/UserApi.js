import * as CryptoJS from 'crypto-js';
import { Platform, Alert } from 'react-native';
import fetch from './ApiManager';
import {
  wehagoBaseURL,
  wehagoBaseURL0,
  serialize,
  createHeader
} from '../../../utils';

const getIp = async () => {
  try {
    let login_ip = await fetch('https://api.ipify.org?format=json');
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
const getToken = async accessUrl => {
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

const getRK = async userPw => {
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
  userId,
  userPw,
  service_code,
  captcha = false,
  access_pass
) => {
  try {
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

    const response = await fetch(`${wehagoBaseURL0}${url}`, data);
    return response;
  } catch (err) {
    return { resultCode: null, resultMsg: err };
  }
};

const serviceDeployCheck = async (auth, cno) => {
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
  // getUserInfo,
  loginRequest,
  // logoutRequest,
  // userCheck,
  // changeCompany,
  serviceDeployCheck
};


/**
 * logoutRequest
 * 로그아웃
 * @param auth
 */
// const logoutRequest = async auth => {
//   const { AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY } = auth;

//   try {
//     const url = `${wehagoBaseURL}/auth/logout`;
//     const headers = createHeader({ AUTH_A_TOKEN, AUTH_R_TOKEN, url, HASH_KEY });
//     const data = {
//       method: 'GET',
//       headers
//     };

//     const response = await fetch(url, data);
//     return response.resultData;
//   } catch (err) {
//     console.warn('err', err);
//     return false;
//   }
// };

/**
 * userCheck
 * 로그인 및 사용자 정보 확인
 * @param AUTH_A_TOKEN
 * @param AUTH_R_TOKEN
 * @param cno String or Number
 * @param HASH_KEY
 */
// const userCheck = async (AUTH_A_TOKEN, AUTH_R_TOKEN, cno, HASH_KEY) => {
//   try {
//     const url = `${wehagoBaseURL}/common/user/userinfo/detail?cno=${cno}`;
//     const headers = createHeader({ AUTH_A_TOKEN, AUTH_R_TOKEN, url, HASH_KEY });

//     const response = await fetch(url, { method: 'GET', headers }, false);
//     return response;
//   } catch (errors) {
//     console.warn('userCheck', errors);
//     return { errors };
//   }
// };
// const getUserInfo = async (auth, company, user_no) => {
//   const { AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY } = auth;
//   try {
//     const params = {
//       user_no: user_no,
//       cno: company.cno
//     };
//     const url = `${wehagoBaseURL}/common/user/userinfo/list?${serialize(
//       params
//     )}`;
//     const header = createHeader({ AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY, url });
//     const data = {
//       method: 'GET',
//       headers: Object.assign({}, header, {
//         'Content-type': 'application/x-www-form-urlencoded'
//       })
//     };
//     const response = await fetch(url, data);

//     return response.resultData.find(item => item.company_no === company.cno);
//   } catch (err) {
//     console.warn('getUserInfo', err);
//     return {
//       error: err
//     };
//   }
// };
/**
 * changeCompany
 * 회사 변경
 * @param auth
 * @param user_no String or Number
 * @param company
 */
// const changeCompany = async (auth, user_no, company) => {
//   const { AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY, last_access_company_no } = auth;
//   const { company_no, company_code } = company;
//   const t = getT();
//   try {
//     const url = `${wehagoBaseURL}/common/layout/company-change`;
//     const headers = createHeader({ AUTH_A_TOKEN, AUTH_R_TOKEN, url, HASH_KEY });
//     const data = {
//       method: 'POST',
//       headers: {
//         ...headers,
//         'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
//       },
//       body: serialize({
//         user_no,
//         last_access_company_no: company_no,
//         login_browser: 'WEHAGO-APP',
//         login_os: Platform.OS,
//         login_device: Platform.OS,
//         login_ip: await getIp(),
//         cno: last_access_company_no,
//         ccode: company_code,
//         portal_member_no: ''
//       })
//     };

//     const response = await fetch(url, data);
//     if (response.resultCode === 200) return true;
//     else Alert.alert(t('alert_title_change'), t('alert_text_onemore'));
//   } catch (err) {
//     console.warn('changeCompany', err);
//     return false;
//   }
// };


