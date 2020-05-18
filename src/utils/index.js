/**
 * Utils - INDEX
 * 공통모듈
 */

import { Platform } from 'react-native';
import CryptoJS from 'crypto-js';
import { WEHAGO_ENV } from '../../config';

const isWehagoV = WEHAGO_ENV === 'WEHAGOV';

const OS = Platform.OS;
const OSID = OS === 'ios' ? 'mobile-ios' : 'mobile-android';
/**
 * Back-end URL
 */
// export const wehagoBaseURL0 = `http://dev.api0.wehagov.com`; // 비인증
// export const wehagoBaseURL = `http://dev.api.wehagov.com`; // 인증
// export const wehagoMainURL = `http://dev.wehagov.com`; // 메인 URL
export const wehagoBaseURL0 = `https://api0.wehago${isWehagoV ? 'v' : ''}.com`;
export const wehagoBaseURL = `https://api.wehago${isWehagoV ? 'v' : ''}.com`;
export const wehagoMainURL = `https://www.wehago${isWehagoV ? 'v' : ''}.com`;
export const wehagoStaticURL = `https://static.wehago${isWehagoV ? 'v' : ''}.com`;

/**
 * Querystring parser
 */
export const querystringParser = url => {
  let result = {};
  let name;
  let value;
  // 쿼리스트링 파싱
  const rawData = url.split('?')[1] ? url.split('?')[1] : url.split('?')[0];
  const params = rawData.split('&');
  params.forEach(param => {
    param = param.split('=');
    name = param[0];
    value = param[1];
    if (name.length)
      if (result[name] !== undefined) {
        if (!result[name].push) {
          result[name] = [result[name]];
        }
        result[name].push(value || '');
      } else {
        result[name] = value || '';
      }
  });
  // alert(result);
  return result;
};

/**
 * 인증 API securityRequest
 * @param {*} a_token
 * @param {*} r_token
 * @param {*} url
 * @param {*} HASH_KEY
 */
export const securityRequest = (a_token, r_token, url, HASH_KEY) => {
  // a_token, r_token, url, HASH_KEY 모두 값이 안들어옴 >> ApiManager.js/_makeHeaders()

  const transactionId = _getTransactionId();
  const clientId = OSID;
  // const clientId = _getServiceCode();
  const service = _getService(url);
  const timestamp = Math.floor(Date.now() / 1000);
  const wehagoSign = _getWehagoSign(url, timestamp, transactionId, HASH_KEY);
  const signature = _createSignature(String(url) + String(a_token));

  const rs = {
    Authorization: `Bearer ${a_token}`,
    'transaction-id': transactionId,
    'wehago-sign': wehagoSign,
    'client-id': clientId,
    'Wehago-S': HASH_KEY,
    timestamp: String(timestamp),
    signature: signature,
    service: service,
    Cookie: `AUTH_A_TOKEN=${a_token}; AUTH_R_TOKEN=${r_token}`
  };

  return rs;
};

// serialize
export const serialize = obj => {
  let str = [];
  for (let p in obj)
    if (obj.hasOwnProperty(p)) {
      // str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      str.push(p + '=' + obj[p]);
    }
  return str.join('&');
};

_getTransactionId = () => {
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
  let string_length = 10;
  let randomstring = '';
  for (let i = 0; i < string_length; i++) {
    let rnum = Math.floor(Math.random() * chars.length);
    randomstring += chars.substring(rnum, rnum + 1);
  }
  return randomstring;
};

_getServiceCode = () => {
  //let serviceCodeList ="contacts,mail,humanresource,schedule,account,company,wedrive,communication,10mbook,invoice,cloudfax,accounts,smartsquare";
  //let authCodeList="landing,login"
  if (process.env.cell && process.env.CHECK_TYPE !== 'local') {
    let serviceCode = document.location.pathname.replace(/\//gi, '');
    return serviceCode;
  } else {
    let portalUrl = window.location.href;
    let path = portalUrl.split('/#/')[1];
    let serviceCode = '';
    //if (path !== "") {
    if (path) {
      serviceCode = path.split('/')[0];
    }

    serviceCode = serviceCode.toLowerCase();

    if (serviceCode === 'm') {
      serviceCode = path.split('/')[1];
    }
    if (serviceCode === 'account') {
      serviceCode = path.split('/')[1];
    }
    if (serviceCode.indexOf('?') > -1) {
      serviceCode = serviceCode.split('?')[0];
    }
    return serviceCode;
  }
};

_getService = url => {
  // console.log('_getService : ' + url);
  let service = '';
  if (url.split('/').length > 2) {
    service = url.split('/')[3];
  }
  return service;
};

_getWehagoSign = (url, timestamp, transactionId, HASH_KEY) => {
  let hash_key = HASH_KEY;
  // alert(hash_key);
  hash_key = CryptoJS.SHA256(
    (String(hash_key) + timestamp).toString(CryptoJS.enc.Utf8),
    String(hash_key)
  ).toString(CryptoJS.enc.Base64);
  let wehagoSign = CryptoJS.enc.Base64.stringify(
    CryptoJS.HmacSHA256(
      _getLocation(url).pathname +
        _getLocation(url).search +
        timestamp +
        transactionId,
      hash_key
    )
  );
  return wehagoSign;
};

_getLocation = url => {
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

export const _createSignature = url => {
  return CryptoJS.enc.Base64.stringify(CryptoJS.SHA256(url));
};

/**
 * changeValue
 * input 데이터 변경 함수
 */
handleChangeValue = (obj, target, value) => {
  obj.setState({ [target]: value });
};

/**
 *
 */
let drawingManager;
export const setDrawingManager = drawing => {
  if (!drawingManager) {
    drawingManager = drawing;
  }
  window.drawingManager = drawingManager;
};

/**
 *
 */
export const getDrawingManager = () => {
  return drawingManager;
};
