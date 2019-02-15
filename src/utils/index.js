/**
 * Utils - INDEX
 * 공통모듈
 */

// import { UserApi, WetalkApi } from '../services';

/**
 * Back-end URL
 */
export const wehagoBaseURL = `https://api.wehago.com`;

/**
 * Querystring parser
 */
export const querystringParser = url => {
	let result = {};
	let name;
	let value;
	// 쿼리스트링 파싱
	const rawData = url.split('?')[1] ? url.split('?')[1] : url.split('?')[0];
	const params = rawData.split('&');
	params.forEach(param => {
		param = param.split('=');
		name = param[0];
		value = param[1];
		if (name.length)
			if (result[name] !== undefined) {
				if (!result[name].push) {
					result[name] = [result[name]];
				}
				result[name].push(value || '');
			} else {
				result[name] = value || '';
			}
	});
	return result;
};
