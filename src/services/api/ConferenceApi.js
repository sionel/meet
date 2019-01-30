/**
 * We talk API
 * 사용자 관련 API
 */

import { wehagoBaseURL } from '../../utils';

// #region
export default {
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
		try {
			const url = `${wehagoBaseURL}/communication/rtc/videoChat`;
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({
					room_id,
					owner_id,
					owner_name,
					cno,
					ccode,
					timestamp
				})
			});
			return response.json();
		} catch (err) {
			return err;
		}
	},

	/**
	 * We talk발송
	 */
	sendWetalk: async (room_id, video_chat_id, cno, ccode, token) => {
		let body = new FormData();
		// 가변값
		body.append('room_id', room_id);
		body.append('chat_type', '1');
		body.append('content_type', '8');
		body.append('content', '');
		body.append('service_code', 'webrtc');
		body.append('service_data', JSON.stringify([{ video_chat_id }]));
		body.append('mobile_key', video_chat_id);
		body.append('file', '');
		body.append('ccode', ccode);
		body.append('cno', cno);

		const bodyData = {
			room_id: room_id,
			chat_type: '1',
			content_type: '8',
			content: '',
			service_code: 'webrtc',
			service_data: JSON.stringify([{ video_chat_id }]),
			mobile_key: video_chat_id,
			file: '',
			ccode: ccode,
			cno: cno
		};

		try {
			const url = `${wehagoBaseURL}/communication/we-talk/talk-send`;
			const requestData = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					Authorization: `Bearer ${token}`
				},
				// body
				body: new URLSearchParams(bodyData).toString()
			};
			const response = await fetch(url, requestData);
			return response.json();
		} catch (err) {
			throw err;
		}
	}
};
// #endregion
