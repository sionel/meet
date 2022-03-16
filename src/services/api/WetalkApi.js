import { wehagoBaseURL, securityRequest, meetURL } from '../../utils';
import { getT } from '../../utils/translateManager';

export default {
  getWetalkList: async auth => {
    const { AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY, user_id, cno } = auth;

    /*
		a_token: 인증토큰
		cno: 회사코드
		room_type: 0 - 전체 
    */
    // alert(1);
    const url = `${meetURL}/communication/rtc-room-list?user_id=${user_id}&cno=${cno}`;
    const headers = securityRequest(AUTH_A_TOKEN, AUTH_R_TOKEN, url, HASH_KEY);
    const t = getT();
    try {
      const data = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          ...headers
        }
      };
      const response = await fetch(url, data);
      const { resultData } = await response.json();
      return resultData;
    } catch (err) {
      // alert(t('alert_text_problem_ocurred'));
      return { video_room_list: false };
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
      alert(t('alert_text_problem_ocurred'));
      return false;
    }
  }
};
