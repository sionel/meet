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
    console.log('authData', authData)
    console.log('initInfo', initInfo)
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
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...headers
      },
      body: serialize({
        ...initInfo,
        cno: authData.cno,
        ccode: authData.ccode,
      })
    };

    console.log('data', url, data)

    const response = await fetch(url, data);
    const responseJson = await response.json();
    console.log('responseJson',responseJson)
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
    console.log('fileInfo', fileInfo)
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
        // 'client-id': 'communication',
        service: "ObjectStorageService",
        method: fileInfo.method
      },
      body: serialize({
        Ext: fileInfo.Ext,
        FileName: fileInfo.FileName,
        cno: authData.cno,
        target_cno: authData.cno,
        ServiceCode: 'wedrive',
        ServiceKey: '',
        BucketType: 'C',
        BucketName: undefined,
        isWedrive: true,
        isFullPreview: false,
        TokenID:'9xORMqokZilA5i4iHAbKrrXfvbJ34l'
      })
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
