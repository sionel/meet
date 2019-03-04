/**
 * Utils - INDEX
 * 공통모듈
 */

// import { UserApi, WetalkApi } from '../services';
import CryptoJS from 'crypto-js';

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

/**
 * 인증 API securityRequest
 * @param {*} token 
 * @param {*} url 
 * @param {*} HASH_KEY 
 */
export const securityRequest = (token, url, HASH_KEY) => {
	const transactionId = _getTransactionId();
	const clientId = _getServiceCode();
	const service = _getService(url);
	const timestamp = Math.floor(Date.now() / 1000);
	const wehagoSign = _getWehagoSign(url, timestamp, transactionId, HASH_KEY);

	return {
		Authorization: `Bearer ${token}`,
		'transaction-id': transactionId,
		'client-id': clientId,
		service: service,
		'wehago-sign': wehagoSign,
		timestamp: timestamp
	};
};

_getTransactionId = () => {
	let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
	let string_length = 10;
	let randomstring = '';
	for (let i = 0; i < string_length; i++) {
		let rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum, rnum + 1);
	}
	return randomstring;
};

_getServiceCode = () => {
	//let serviceCodeList ="contacts,mail,humanresource,schedule,account,company,wedrive,communication,10mbook,invoice,cloudfax,accounts,smartsquare";
	//let authCodeList="landing,login"
	if (process.env.cell && process.env.CHECK_TYPE !== 'local') {
		let serviceCode = document.location.pathname.replace(/\//gi, '');
		return serviceCode;
	} else {
		let portalUrl = window.location.href;
		let path = portalUrl.split('/#/')[1];
		let serviceCode = '';
		//if (path !== "") {
		if (path) {
			serviceCode = path.split('/')[0];
		}

		serviceCode = serviceCode.toLowerCase();

		if (serviceCode === 'm') {
			serviceCode = path.split('/')[1];
		}
		if (serviceCode === 'account') {
			serviceCode = path.split('/')[1];
		}
		if (serviceCode.indexOf('?') > -1) {
			serviceCode = serviceCode.split('?')[0];
		}
		return serviceCode;
	}
};

_getService = url => {
	let service = '';
	if (url.split('/').length > 2) {
		service = url.split('/')[3];
	}
	return service;
};

_getWehagoSign = (url, timestamp, transactionId, HASH_KEY) => {
	let hash_key = HASH_KEY;
	// alert(hash_key);
	hash_key = CryptoJS.SHA256((String(hash_key) + timestamp).toString(CryptoJS.enc.Utf8), String(hash_key)).toString(
		CryptoJS.enc.Base64
	);
	let wehagoSign = CryptoJS.enc.Base64.stringify(
		CryptoJS.HmacSHA256(_getLocation(url).pathname + _getLocation(url).search + timestamp + transactionId, hash_key)
	);
	return wehagoSign;
};

_getLocation = url => {
	var match = url.match(/^(https?:)\/\/(([^:/?#]*)(?::([0-9]+))?)([/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
	const ret = match && {
		protocol: match[1],
		host: match[2],
		hostname: match[3],
		port: match[4],
		pathname: match[5],
		search: match[6],
		hash: match[7]
	};
	return ret;
};
