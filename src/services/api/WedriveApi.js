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
const getToken = async (a_token, r_token, HASH_KEY, portalID) => {
  try {
    const url = `${wehagoBaseURL}/WeDriveStorage/services/login`;
    const headers = securityRequest(a_token, r_token, url, HASH_KEY);

    const data = {
      method: 'POST',
      headers: {
        ...headers, // 위하고 사인
        Accept: 'application/json',
        'Content-Type': 'application/json',
        method: 'login',
        service: 'loginService'
      },
      body: JSON.stringify({
        TokenID: a_token,
        portalID: portalID
      })
    };

    const response = await fetch(url, data);
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
const getList = async (authData, TokenID) => {
  try {
    const url = `${wehagoBaseURL}/WeDriveStorage/services/login`;
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
        method: 'getFileListObject',
        service: 'storageService'
        // method: 'getRootFileListObject', // 공유폴더까지 조회
        // service: 'wedriveShareService'
      },
      body: JSON.stringify({
        TokenID: TokenID,
        FileUniqueKey: `${authData.portalID}@` // 공유폴더까지 조회
      })
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
        TokenID: fileInfo.TokenID,
        method: fileInfo.method,
        service: 'objectStorageService'
      },
      body: serialize(fileInfo)
    };

    const response = await fetch(url, data);
    const responseJson = await response.json();
    return responseJson;
  } catch (err) {
    console.warn(err);
    return err;
  }
};

/**
 * wedrive directory 상세정보
 */
const getDirectoryInfo = async (authData, directory) => {
  try {
    const url = `${wehagoBaseURL}/WeDriveStorage/services/login`;
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
        // TokenID: directory.TokenID,
        method: 'getFileListObject',
        service: 'storageService'
      },
      body: JSON.stringify(directory)
    };

    const response = await fetch(url, data);
    const responseJson = await response.json();
    return responseJson;
  } catch (err) {
    console.warn(err);
    return err;
  }
};

export default {
  getToken,
  getList,
  getFileInfo,
  getDirectoryInfo
};
