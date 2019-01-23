/**
 * We talk API
 * 사용자 관련 API
 */

const wehagoBaseURL = `https://api.wehago.com`;

// #region
export default {
	/**
   * We talk list
   * 위톡 리스트
   */
	getWetalkList: async (a_token, c_no, room_type = 0) => {
		const url = `${wehagoBaseURL}/communication/we-talk/room-list?room_type=${room_type}&cno=${c_no}`;

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
	}
};
// #endregion
