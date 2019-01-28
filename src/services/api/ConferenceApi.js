/**
 * We talk API
 * 사용자 관련 API
 */

import { wehagoBaseURL } from '../../utils';

// #region
export default {
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
	},

	/**
	 * 화상대화 생성
	 */
	create: async (room_id, owner_id, owner_name, cno, ccode, timestamp, token) => {
		/*
		"room_id":"_Gj2EWgBeAtpuzEuPdzI",
		"owner_id":"seongh7800",
		"owner_name":"김성훈",
		"cno":"9",
		*/

		console.log(123123);

		// try {
		// 	let body = new FormData();
		// 	const url = `${wehagoBaseURL}/communication/rtc/videoChat`;
		// 	const response = await fetch(url, {
		// 		method: 'POST',
		// 		headers: { Authorization: `Bearer ${token}` },
		// 		body: {
		// 			room_id,
		// 			owner_id,
		// 			owner_name,
		// 			cno
		// 			// ccode,
		// 			// timestamp
		// 		}
		// 	});
		// 	return response.json();
		// } catch (err) {
		// 	return err;
		// }
	},

	/**
	 * 위톡발송
	 */
	sendWetalk: async (room_id, video_chat_id, cno, token) => {
		try {
			const url = `${wehagoBaseURL}/communication/we-talk/talk-send`;
			const response = await fetch(url, {
				method: 'POST',
				headers: { Authorization: `Bearer ${token}` },
				body: {
					room_id: room_id,
					chat_type: '1',
					content_type: '8',
					content: '',
					service_code: 'webrtc',
					service_data: [{ video_chat_id }],
					mobile_key: video_chat_id,
					cno: cno,
					ccode: 'biz201703300000011'
				}
			});
			return response.json();
		} catch (err) {
			return err;
		}
	}
};
// #endregion
