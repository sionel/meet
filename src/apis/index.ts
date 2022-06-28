import { Platform } from 'react-native';
// export { default as videoApi } from './video';

const OS = Platform.OS;

// 개발기,운영기 로 바꾸려면 해당 주석을 이용하자
// export const isDev = true;
export const isDev = false;

export const wehagoBaseURL0 = isDev
  ? `http://dev.api0.wehago.com`
  : `https://api0.wehago.com`;
export const wehagoBaseURL = isDev
  ? `http://dev.api.wehago.com`
  : `https://api.wehago.com`;
export const wehagoMainURL = isDev
  ? `http://dev.wehago.com`
  : `https://www.wehago.com`;

export const meetURL = isDev
  ? `https://rtctest.wehago.com/api-bind`
  : `https://api.wehago.com/video`;
// export const meetURL = `http://localhost:8080/videodev`;

export const wehagoDummyImageURL = `https://static.wehago.com/imgs/dummy/@dummy_02.jpg`; // 더미 프로필
export const wehagoStaticURL = `https://static.wehago.com`;

export const serialize = (obj: { [key: string]: string }) => {
  let str = [];
  for (let p in obj)
    if (obj.hasOwnProperty(p)) {
      // str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      str.push(p + '=' + obj[p]);
    }
  return str.join('&');
};
