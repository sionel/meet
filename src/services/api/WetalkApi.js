/**
 * We talk API
 * 사용자 관련 API
 */

import { meetURL, wehagoBaseURL, securityRequest } from '../../utils';

// #region
export default {
	/**
   * We talk list
   * 위톡 리스트
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
};
// #endregion
