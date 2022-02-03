import CryptoJS from 'crypto-js';
import axios from "axios";
import { authInfo } from '@redux/user';
import { Res } from './types';
import {
  wehagoBaseURL,
  wehagoBaseURL0,
  _getTransactionId,
  securityRequest
} from '@utils/index';
import { Platform } from 'react-native';

const OS = Platform.OS;
const OSID = OS === 'ios' ? 'mobile-ios' : 'mobile-android';

export const postAPI = async <T>(
  endPoint: string,
  data: {},
  auth?: null | authInfo
):Promise<Res<T>> => {
  let url = "";
  let headers = {};
  const contentType = "application/x-www-form-urlencoded; charset=UTF-8";

  if (auth) {
    // 인증 api
    url = `${wehagoBaseURL}${endPoint}`;
    const authHeader = securityRequest(auth, url);
    headers = {
      "Content-Type": contentType,
      ...authHeader,
    };
  } else {
    // 비인증 api
    url = `${wehagoBaseURL0}${endPoint}`;
    const signature = await getSignature(endPoint);
    headers = {
      "Content-Type": contentType,
    };
  }

  return new Promise(async (resolve, reject) => {
    try{

    } 
    catch{

    }
  });
};
