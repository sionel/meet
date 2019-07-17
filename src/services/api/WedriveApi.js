/**
 * Wedrive API
 */

import {
  wehagoBaseURL,
  securityRequest,
  serialize,
  _createSignature
} from '../../utils';

/**
 * getWedriveToken
 */
const getToken = async (a_token, r_token, cno, ccode, HASH_KEY, portalID) => {
  try {
    // const url = `${wehagoBaseURL}/WeDriveStorage/services/login`;
    // // const url = `${wehagoBaseURL}/WeDriveStorage/services/login?TokenID=${a_token}&oAuthTokenId=${a_token}&portalID=${portalID}`;
    // const headers = securityRequest(a_token, r_token, url, HASH_KEY);

    // const data = {
    //   method: 'POST',
    //   headers: {
    //     ...headers, // 위하고 사인
    //     // Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //     'Accept-Language': 'ko-KR;q=1.0',
    //     'Accept-Encoding': 'gzip;q=1.0, compress;q=0.5',
    //     'User-Agent': 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_0 like Mac OS X; en-us)',
    //     method: 'login',
    //     service: 'loginService',
    //   },
    //   // body: serialize({
    //   //   TokenID: a_token,
    //   //   FileUniqueKey: `${portalID}@`
    //   // })
    // };

    const url = `${wehagoBaseURL}/common/wedrive/init-info?cno=${cno}&ccode=${ccode}`;
    const headers = securityRequest(a_token, r_token, url, HASH_KEY);

    const data = {
      method: 'GET',
      headers: {
        ...headers, // 위하고 사인
      },
    };
    console.log(data)
    const response = await fetch(url, data);
    const responseJson = await response.json();
    console.log('result', responseJson)
    return responseJson;
  } catch (err) {
    return err;
  }
};
// #endregion

/**
 * wedrive file list 조회
 */
const getList = async (authData, initInfo) => {
  try {
    // const url = `${wehagoBaseURL}/WeDriveStorage/services/csb`;
    const url = `${wehagoBaseURL}/common/wedrive/get/file-list`;
    const headers = securityRequest(
      authData.AUTH_A_TOKEN,
      authData.AUTH_R_TOKEN,
      url,
      authData.HASH_KEY
    );
    const data = {
      method: 'POST',
      headers: {
        ...headers,
        // Accept: 'application/json',
        // 'Content-Type': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: new URLSearchParams({
        ...initInfo,
        cno: authData.cno,
        ccode: authData.ccode
      }).toString()
    };
    const response = await fetch(url, data);
    const responseJson = await response.json();
    return responseJson;
  } catch (err) {
    return err;
  }
};

/**
 * wedrive file 상세정보
 */
const getFileInfo = async (authData, fileInfo) => {
  try {
    // const url = `http://10.51.115.24:8081/debugger-ui`;
    const url = `${wehagoBaseURL}/ObjectStorageCommon/services/common`;
    const headers = securityRequest(
      authData.AUTH_A_TOKEN,
      authData.AUTH_R_TOKEN,
      url,
      authData.HASH_KEY
    );
    const data = {
      method: 'POST',
      headers: {
        ...headers,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        service: 'storageService',
        method: 'getFileInfoObject'
      },
      body: serialize(fileInfo)
    };

    console.log(data);

    const response = await fetch(url, data);
    const responseJson = await response.json();
    return responseJson;
  } catch (err) {
    return err;
  }
};

export default {
  getToken,
  getList,
  getFileInfo
};
