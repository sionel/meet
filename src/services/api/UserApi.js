/**
 * User API
 * 사용자 관련 API
 */

const wehagoBaseURL = `https://api.wehago.com`;
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
		// urlencoded방식으로 변환
		let formData = new FormData();
		for (let i in data) {
			formData.append(i, data[i]);
		}
		try {
			const timestamp = new Date();
			const url = `${wehagoBaseURL}/auth/login/mobile?timestamp=${timestamp.getMilliseconds()}`;
			const response = await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
				body: formData
			});
			return response.json();
		} catch (err) {
			console.log('Test err: ', err);
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
