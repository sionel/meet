/**
 * We talk API
 * 사용자 관련 API
 */

import { wehagoBaseURL, securityRequest } from '../../utils';

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
			alert('error');
			return false;
		}
	}

	// /**
	//  * 진행중인 화상대화 목록
	//  */
	// getOnairList: async (portal_id, cno) => {
	// 	/*
	// 	portal_id: 찾을아이디
	// 	cno: 회사코드
	// 	*/
	// 	try {
	// 		const url = `${wehagoBaseURL}/communication/rtc/rtc-room-list?user_id=${portal_id}&cno=${cno}`;
	// 		const headers = securityRequest(a_token, url, HASH_KEY);
	// 		const response = await fetch(url, {
	// 			method: 'GET',
	// 			headers
	// 		});
	// 		const responseJson = await response.json();
	// 		return responseJson;
	// 	} catch (err) {
	// 		return err;
	// 	}
	// }
};
// #endregion
