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
const getToken = async (a_token, r_token, cno, ccode, HASH_KEY) => {
  try {
    const url = `${wehagoBaseURL}/common/wedrive/init-info?cno=${cno}&ccode=${ccode}`;
    const headers = securityRequest(a_token, r_token, url, HASH_KEY);

    const response = await fetch(url, {
      method: 'GET',
      headers
    });
    const responseJson = await response.json();
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
        service: 'ObjectStorageService',
        method: fileInfo.method
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
