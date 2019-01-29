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
		console.log(12312312323);
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
		console.log('Token : ', token);

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
			// console.log('RRR : ', response.json());
			return response.json();
		} catch (err) {
			return err;
		}
	},

	/**
	 * We talk발송
	 */
	sendWetalk: async (room_id, video_chat_id, cno, token) => {
		console.log('cno : ', cno);
		console.log('token : ', token);
		console.log('room_id : ', room_id);
		console.log('video_chat_id : ', video_chat_id);

		let formData = new FormData();
		formData.append('room_id', '_Gj2EWgBeAtpuzEuPdzI');
		formData.append('video_chat_id', '_Gj2EWgBeAtpuzEuPdzI_20190129091219nmbqw');
		formData.append('cno', '9');
		formData.append('chat_type', '1');
		formData.append('content_type', '8');
		formData.append('content', '');
		formData.append('service_code', 'webrtc');
		formData.append('service_data', '[{"video_chat_id":"_Gj2EWgBeAtpuzEuPdzI_20190129091219nmbqw"}]');
		formData.append('file', '');

		const jsonData = JSON.stringify({
			room_id: '_Gj2EWgBeAtpuzEuPdzI',
			chat_type: '1',
			content_type: '8',
			content: '',
			service_code: 'webrtc',
			service_data: '[{"video_chat_id":"_Gj2EWgBeAtpuzEuPdzI_20190129091219nmbqw"}]',
			file: '',
			ccode: 'biz201703300000011',
			cno: '9'
		});

		console.log('Form : ', formData);

		try {
			const url = `${wehagoBaseURL}/communication/we-talk/talk-send`;
			const method = 'POST';
			const headers = {
				'Content-Type': 'application/x-www-form-urlencoded',
				// 'Content-Type': 'application/json',
				Authorization: 'Bearer C6rZbSWRfIV5DwB3Hivah9BZo6eAUd'
			};
			const response = await fetch(url, {
				method,
				headers,
				body: formData
			});
			console.log('response : ', response);

			return response.json();
		} catch (err) {
			throw err;
		}
	}
};
// #endregion
