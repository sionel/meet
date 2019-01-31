/**
 * User API
 * 사용자 관련 API
 */

import { wehagoBaseURL } from '../../utils';
const tempBaseUrl = `https://jsonplaceholder.typicode.com`;

// #region
export default {
	/**
     * TEST 
     * 테스트 api
     */
	test: () =>
		fetch(`${tempBaseUrl}/posts`)
			.then(response => response.json())
			.then(responseJson => responseJson)
			.catch(err => {
				// alert('Login Error!')
				console.log('login err: ', err);
			}),

	/**
	 * Login 
	 * --
	 * JSON형태로 데이터를 전송할수없음 => urlencoded방식으로 전달
	 */
	login: async data => {
		const body = {
			portal_id: data.portal_id,
			portal_password: data.portal_password,
			// 기기정보
			login_ip: '10.51.114.169',
			login_device: 'iPhone',
			login_os: 'IOS 12.1.2',
			login_browser: 'WEHAGO-APP'
		};

		try {
			const url = `${wehagoBaseURL}/auth/login/mobile`;
			const response = await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
				body: new URLSearchParams(body).toString()
			});

			return response.json();
		} catch (err) {
			return false;
		}
	},

	/**
	 * check
	 * 로그인 및 사용자 정보 확인 - 토큰만료 또는 정보변경시 자동로그인
	 */
	check: async (token, cno) => {
		try {
			const url = `${wehagoBaseURL}/common/user/userinfo/detail?cno=${cno}`;
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			return response.json();
		} catch (err) {
			console.log(err);
			return err;
		}
	}
};
// #endregion
