import { wehagoMainURL, wehagoBaseURL } from '@utils/index';
/**
 * config
 * 기본(wehago) 관련 설정입니다.
 */
const config = {
  baseGuestUrl: wehagoMainURL + '',
  baseApiUrl: wehagoMainURL + '/communication/rtc/',
  baseGuestApiUrl: wehagoMainURL + '/communication/rtc/',
  wehagoBaseURL: wehagoBaseURL + '/communication/rtc/'
};
export default config;
