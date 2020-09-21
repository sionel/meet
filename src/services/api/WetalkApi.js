/**
 * We talk API
 * 사용자 관련 API
 */

import { meetURL, wehagoBaseURL, securityRequest } from '../../utils';

// #region
export default {
  /**
   * We talk list
   * 메신저 리스트
   */
  getWetalkList: async (a_token, r_token, cno, user_id, HASH_KEY) => {
    /*
		a_token: 인증토큰
		cno: 회사코드
		room_type: 0 - 전체 
    */
    // alert(1);
    const url = `${wehagoBaseURL}/communication/rtc/rtc-room-list?user_id=${user_id}&cno=${cno}`;
    const headers = securityRequest(a_token, r_token, url, HASH_KEY);
    try {
      const data = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          ...headers
        }
      };
      const response = await fetch(url, data);
      return response.json();
    } catch (err) {
      alert('사소한 문제가 발생했습니다. 다시 시도해 주세요');
      return false;
    }
  },

  getWetalkList2:  async (a_token, r_token, cno, user_id, HASH_KEY) => {
    /*
		a_token: 인증토큰
		cno: 회사코드
		room_type: 0 - 전체 
    */
	// alert(1);
	const time = new Date().getTime()
	const url = `${wehagoBaseURL}/communication/we-talk/room-list?room_type=0&room_sort=1&t=${time}&cno=${cno}`;
    const headers = securityRequest(a_token, r_token, url, HASH_KEY);
    try {
      const data = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          ...headers
        }
      };
	  const response = await fetch(url, data);
	  
      return response.json();
    } catch (err) {
      alert('사소한 문제가 발생했습니다. 다시 시도해 주세요');
      return false;
    }
  },

  didUpdate: async (a_token, r_token, HASH_KEY) => {
    // 메신저이 meet을 바라보는 업데이트가 되었는지 체크
    const url = `${wehagoBaseURL}/communication/we-talk/testUserList`;
    const headers = securityRequest(a_token, r_token, url, HASH_KEY);
    try {
      const data = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          ...headers
        }
      };
      const response = await fetch(url, data);
      return response.json();
    } catch (err) {
      alert('사소한 문제가 발생했습니다. 다시 시도해 주세요');
      return false;
    }
  }
};
// #endregion
