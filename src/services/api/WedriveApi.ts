/**
 * Wedrive API
 */

import {
  wehagoBaseURL,
  securityRequest,
  serialize,
  _createSignature
} from '@utils/index';
import axios from 'axios';

import FetchCancel from 'react-native-cancelable-fetch';

interface authDataType {
  AUTH_A_TOKEN: string;
  AUTH_R_TOKEN: string;
  HASH_KEY: string;
  portalID: string;
  last_access_company_no: string;
}
/**
 * getWedriveToken
 */
const getToken = async (
  a_token: string,
  r_token: string,
  HASH_KEY: string,
  portalID: string
) => {
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
const getList = async (authData:authDataType, TokenID:string) => {
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
const getFileInfo = async (authData:authDataType, fileInfo:any, isFullPreview = 'false') => {
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
        TokenID: fileInfo.TokenID, // wedrive token
        method: fileInfo.method,
        service: 'objectStorageService'
      },
      body: serialize({
        ...fileInfo,
        isFullPreview
      })
    };
    
    return FetchCancel(url, data, 'getFileInfo')
      .then((response:Response) => response.json())
      .then((responseJson:any) => {
        if (
          responseJson.resultList &&
          responseJson.resultList[0].isFullPreview === false
        ) {
          // 썸네일이 없을 경우 생성 (2MB 이상일 경우)
          return getFileInfo(authData, fileInfo, 'true');
          // } else if (
          //   responseJson.resultList &&
          //   responseJson.resultList[0].isFullPreview === true &&
          //   !responseJson.resultList[0].resources
          // ) {
          //   // 썸네일 생성이 실패한 경우 재생성 요청 (현재 API 미개발 상태)
          //   console.log(2, fileInfo, responseJson);
          //   return setRemakeThumbNail(authData:authDataType, fileInfo);
          // return responseJson;
        } else return responseJson;
      });

    // const response = await fetch(url, data);
    // const responseJson = await response.json();
    // return responseJson;
  } catch (err) {
    console.warn(err);
    return err;
  }
};

// (현재 API 미개발 상태)
// const setRemakeThumbNail = async (authData:authDataType, fileInfo:any) => {
//   try {
//     const url = `${wehagoBaseURL}/ObjectStorageCommon/services/login`;
//     const headers = securityRequest(
//       authData.AUTH_A_TOKEN,
//       authData.AUTH_R_TOKEN,
//       url,
//       authData.HASH_KEY
//     );
//     const bodyData = {
//       fileName: fileInfo.FileName,
//       bucketName: 'undefined',
//       ext: fileInfo.Ext,
//       cno: fileInfo.cno,
//       thumbNailPath: '',
//       isWedrive: true,
//       isConvert: true
//       // ...fileInfo,
//       // BucketType: 'C',
//       // BucketName: 'undefined',
//       // ServiceKey: '',
//       // ServiceCode: 'wedrive',
//       // cno: fileInfo.cno,
//       // target_cno: fileInfo.cno,
//       // FileName: fileInfo.FileName,
//       // Ext: fileInfo.Ext,
//       // TokenID: fileInfo.TokenID, // wedrive token
//       // isWedrive: true,
//       // MakeThumbNailType: 'ml'
//     };
//     const data = {
//       method: 'POST',
//       headers: {
//         ...headers,
//         // Accept: 'application/json',
//         'Content-Type': 'application/json',
//         method: 'setRemakeThumbNail',
//         service: 'thumbImageService'
//       },
//       body: serialize(bodyData)
//     };
//     console.log('bodyData', bodyData, data);

//     return FetchCancel(url, data, 'getFileInfo')
//       .then(response => response.json())
//       .then(responseJson => {
//         console.log('responseJson11', responseJson);
//         alert(responseJson.serverMsg);
//         return responseJson;
//       });
//   } catch (err) {
//     console.warn(err);
//     return err;
//   }
// };

/**
 * wedrive directory 상세정보
 */
const getDirectoryInfo = async (authData:authDataType, directory:any) => {
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
    // console.log(response)
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
