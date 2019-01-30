/**
 * We talk API
 * 사용자 관련 API
 */

import { wehagoBaseURL } from '../../utils';

// #region
export default {
	/**
   * We talk list
   * 위톡 리스트
   */
	getWetalkList: async (a_token, cno, user_id) => {
		/*
		a_token: 인증토큰
		cno: 회사코드
		room_type: 0 - 전체 
		*/
		const url = `${wehagoBaseURL}/communication/rtc/rtc-room-list?user_id=${user_id}&cno=${cno}`;

		try {
			const data = {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${a_token}`,
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				}
			};
			const response = await fetch(url, data);
			return response.json();
		} catch (err) {
			return false;
		}
	},

	/**
   * We talk list
   * 위톡 리스트 - 구버전
   */
	getWetalkList_old: async (a_token, cno, room_type = 0) => {
		/*
		a_token: 인증토큰
		cno: 회사코드
		room_type: 0 - 전체 
		*/
		const url = `${wehagoBaseURL}/communication/we-talk/room-list?room_type=${room_type}&cno=${cno}`;

		try {
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${a_token}`,
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				}
			});
			return response.json();
		} catch (err) {
			console.log('Test err: ', err);
			return false;
		}
	},

	/**
	 * 진행중인 화상대화 목록
	 */
	getOnairList: async (portal_id, cno) => {
		/*
		portal_id: 찾을아이디
		cno: 회사코드
		*/
		try {
			const url = `${wehagoBaseURL}/communication/rtc/rtc-room-list?user_id=${portal_id}&cno=${cno}`;
			const response = await fetch(url);
			const responseJson = await response.json();
			return responseJson;
		} catch (err) {
			console.log('getOnairList Error: ', err);
			return err;
		}
	}
};
// #endregion
