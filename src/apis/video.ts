import { PlatformOSType } from 'react-native';
import { getToken, isDev, meetURL, wehagoBaseURL0 } from '.';
import CryptoJS from 'crypto-js';
 
export default {
  checkVersion: async (os: PlatformOSType, major: number) => {
    let url = '';
    let signature = '';
    if (isDev) {
      url = `${meetURL}/mobile/version?os=${os}&major=${major}`;
    } else {
      const accsessUrl = `/video/mobile/version?os=${os}&major=${major}`;
      const token = await getToken(accsessUrl);
      const encText = accsessUrl + token.cur_date + token.token;
      const hashText = CryptoJS.SHA256(encText);
      signature = CryptoJS.enc.Base64.stringify(hashText);
      url = `${wehagoBaseURL0}${accsessUrl}`;
    }

    const data = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        signature
      }
    };
    const response = await fetch(url, data);
    debugger
    if (response.status !== 200) {
      throw await response.json();
    }
    return response.json();
  }
};
