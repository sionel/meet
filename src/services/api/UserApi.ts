/**
 * User API
 * 사용자 관련 API
 */
import DeviceInfo from 'react-native-device-info';
import {
  wehagoBaseURL,
  wehagoBaseURL0,
  securityRequest,
  _createSignature,
  serialize
} from '@utils/index';
const tempBaseUrl = `https://jsonplaceholder.typicode.com`;
import CryptoJS from 'crypto-js';
import Axios from './Axios';
import { isSuccess, Res } from '@services/types';
import { apiAuthInfo, companyInfo, errorType, userInfo } from './types';
import { Alert } from 'react-native';
import { companyParamInfo } from '@redux/user';

// #region
/**
 * TEST
 * 테스트 api
 */
// const test = async auth => {
//   const { AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY, cno } = auth;

//   Axios(`${wehagoBaseURL}/auth/fromsoftware/userDeviceInfo`)
//     .then(response => response.json())
//     .then(responseJson => responseJson)
//     .catch(err => {
//       console.log('login err: ', err);
//     });
// };

/**
 *
 */
// const getToken = async accessUrl => {
//   try {
//     const url = `${wehagoBaseURL0}/get_token/?url=${accessUrl}`;
//     const data = {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
//       }
//     };
//     const response = await Axios(url, data);
//     const responseJson = await response.json();
//     console.warn('getToken : ', responseJson);

//     return responseJson;
//   } catch (err) {
//     if (err.message === 'timeout') {
//       await new Promise(res => {
//         alert('네트워크가 불안정합니다.');
//       });
//     }
//     return false;
//   }
// };

/**
 * Login
 * --
 * JSON형태로 데이터를 전송할수없음 => urlencoded방식으로 전달
 */
//TODO: 어디서 쓰는 함수인지 파악 X
// const login = async (user, captcha, access_pass) => {
//   try {
//     const date = new Date().getTime();
//     const url = captcha
//       ? '/auth/login/exceed'
//       : `/auth/login/mobile?timestamp=${date}`;
//     const getTokenResult = await getToken(`${url}`);
//     const encText = url + getTokenResult.cur_date + getTokenResult.token;
//     const hashText = CryptoJS.SHA256(encText);
//     const signature = CryptoJS.enc.Base64.stringify(hashText);

//     const data = {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
//         signature: signature
//       },
//       body: serialize({
//         access_type: 'wehagomeet',
//         access_pass: access_pass,
//         portal_id: user.portal_id,
//         portal_password: user.portal_password,
//         login_ip: user.login_ip,
//         login_os: user.login_os,
//         login_device: user.login_device,
//         login_browser: user.login_browser,
//         login_type: 'MOBILE'
//       })
//     };

//     const response = await Axios(`${wehagoBaseURL0}${url}`, data);
//     const responseJson = await response.json();
//     console.warn('success', responseJson);
//     return responseJson;
//   } catch (err) {
//     console.warn('er', err);
//     if (err.message === 'timeout') {
//       await new Promise(res => {
//         alert('네트워크가 불안정합니다.');
//       });
//     }

//     return false;
//   }
// };

/**
 * logoutRequest
 * 로그아웃
 * @param auth
 */
const logoutRequest = async (auth: apiAuthInfo) => {
  const { AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY } = auth;

  const url = `${wehagoBaseURL}/auth/logout`;
  const headers = securityRequest(AUTH_A_TOKEN, AUTH_R_TOKEN, url, HASH_KEY);
  const data = {
    method: 'GET',
    headers
  };

  const response = await Axios(url, data);

  if (isSuccess(response)) {
    return response;
  } else {
    console.warn('err', response);
  }
};

const getDeviceInfo = async (auth: apiAuthInfo): Promise<Res<any>> => {
  const { AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY, cno } = auth;

  const url = `${wehagoBaseURL}/auth/fromsoftware/settingUserDeviceInfo`;
  const headers = securityRequest(AUTH_A_TOKEN, AUTH_R_TOKEN, url, HASH_KEY);
  const param = {
    device_id: DeviceInfo.getDeviceId(),
    software_key: '328c574b-eda8-4ab4-a097-d063166a88c8',
    software_name: 'RS10-i'
  };
  const data = {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    body: serialize(param)
  };
  const response = await Axios(url, data);
  if (isSuccess(response)) {
    return response;
  } else {
    return response;
  }
};

/**
 * check
 * 로그인 및 사용자 정보 확인 - 토큰만료 또는 정보변경시 자동로그인
 */
const check = async (
  a_token: string,
  r_token: string,
  cno: string,
  HASH_KEY: string
): Promise<Res<userInfo>> => {
  const url = `${wehagoBaseURL}/common/user/userinfo/detail?cno=${cno}`; // 유저 전체 상세 정보
  const headers = securityRequest(a_token, r_token, url, HASH_KEY);
  const response = await Axios<userInfo>(url, {
    method: 'GET',
    headers
  });

  const url2 = `${wehagoBaseURL}/common/user/userinfo?cno=${cno}&selected_company_no=${cno}`; // 유저 정보 (닉네임 가져오려고 굳이 이걸 불러야하나...)
  const headers2 = securityRequest(a_token, r_token, url2, HASH_KEY);
  const response2 = await Axios<any[]>(url2, {
    method: 'GET',
    headers: headers2
  });

  if (isSuccess(response)) {
    if(isSuccess(response2)) {
      let nickname = response2.resultData[0].nickname;
      response.resultData.nickname = nickname;
    }
    return response;
  } else {
    return response;
  }
};

/**
 * 회사 변경
 */
const changeCompany = async (auth: apiAuthInfo, company: companyParamInfo) => {
  const { AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY, user_no } = auth;
  const { company_no, company_code } = company;
  const deviceIP = await DeviceInfo.getIpAddress();

  const url = `${wehagoBaseURL}/common/layout/company-change`;
  const headers = securityRequest(AUTH_A_TOKEN, AUTH_R_TOKEN, url, HASH_KEY);
  const data = {
    user_no: user_no,
    last_access_company_no: company_no,
    login_browser: 'WEHAGO-APP',
    login_device: DeviceInfo.getModel(),
    login_os: DeviceInfo.getSystemName() + ' ' + DeviceInfo.getSystemVersion(),
    login_ip: deviceIP,
    cno: company_no,
    ccode: company_code,
    portal_member_no: ''
  };
  const response = await Axios(url, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    body: serialize(data)
  });
  if (isSuccess(response)) {
    return response;
  } else {
    return response;
  }
};

// #endregion

export default {
  // test,
  // getToken,
  // login,
  logoutRequest,
  check,
  changeCompany,
  getDeviceInfo
};
