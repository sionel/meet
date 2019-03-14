/**
 * user
 * user 스토어
 */

import { UserApi } from '../../services';

const AGREEMENT = 'AGREEMENT';
const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';
const TOKEN = 'TOKEN';
// const TOKEN_LOGIN = 'TOKEN_LOGIN';
const INTRO = 'INTRO';
const CHANGE_COMPANY = 'CHANGE_COMPANY';

//#region Action Creators

/**
 * agreement
 */
function agreement() {
	return { type: AGREEMENT };
};

/**
 * login
 */
function login(auth) {
	return {
		type: LOGIN,
		auth
	};
};

function loginRequest(data) {
	return async () => {
		return await UserApi.login(data);
	}
}

function loginCheckRequest(AUTH_A_TOKEN, AUTH_R_TOKEN, cno, HASH_KEY) {
	return async (dispatch) => {
		const checkResult = await UserApi.check(AUTH_A_TOKEN, cno, HASH_KEY);
		if (checkResult.resultCode === 200) {
			const userData = {
				// login api data
				AUTH_A_TOKEN,
				AUTH_R_TOKEN,
				HASH_KEY,
				// check api data
				user_no: checkResult.resultData.user_no,
				portal_id: checkResult.resultData.portal_id, // 아이디
				user_name: checkResult.resultData.user_name,
				user_email: checkResult.resultData.user_email,
				profile_url: checkResult.resultData.profile_url,
				user_contact: checkResult.resultData.user_contact,
				employee_list: checkResult.resultData.employee_list, // 회사정보
				last_access_company_no: checkResult.resultData.last_access_company_no,
				last_company: checkResult.resultData.employee_list.filter(
					e => e.company_no == checkResult.resultData.last_access_company_no
				)[0]
			};
			return dispatch(login(userData));
		} else {
			return false;
		}
	}
}

/**
 * logout
 */
function logout(auth) {
	return {
		type: LOGIN,
		auth
	};
};

/**
 * tokenTest
 */
function token(auth) {
	return {
		type: TOKEN,
		newToken: 100
	};
};

/**
 * intro skip
 */
function intro() {
	return { type: INTRO };
};

/**
 * CHANGE_COMPANY
 */
function changeCompany(cno) {
	return {
		type: CHANGE_COMPANY,
		payload: { cno }
	};
};

/**
 * tokenLogin : ACTION
 */
// function tokenLogin(token, cno) {
// 	alert('준비중입니다.');
// 	// return;
// 	const result = UserApi.check(token, cno);
// 	console.log('tokenLogin : ', typeof result);

// 	function retur(dispatch) {
// 		dispatch({
// 			type: TOKEN_LOGIN,
// 			payload: {
// 				token
// 			}
// 		});
// 	};
// };

/**
 * applyTokenLogin
 */
// function applyTokenLogin(state, action) {
// 	return state;
// };

//#endregion

//#region initialState

const initialState = {
	auth: null,
	permission: false,
	intro: false
};

//#endregion initialState

//#region Reducer

function reducer(state = initialState, action) {
	switch (action.type) {
		case AGREEMENT:
			return { ...state, permission: !state.permission };
		case LOGIN:
			return { ...state, auth: action.auth };
		// return applyTest(state, action);
		case LOGOUT:
			return { ...state, auth: null };
		case TOKEN:
			let auth = state.auth;
			auth.AUTH_A_TOKEN = action.newToken;
			return {
				...state,
				auth
			};
		// case TOKEN_LOGIN:
		// 	return applyTokenLogin(state, action);
		case INTRO:
			return { ...state, intro: true };
		case CHANGE_COMPANY:
			applyChangeCompany(state, action);
		default:
			return state;
	}
};

//#endregion Reducer

//#region Reducer Functions

/**
 * applyTest
 */
// function applyTest(state, action) {
// 	const { test } = action;
// 	return {
// 		...state,
// 		test
// 	};
// };

/**
 * 
 */
function applyChangeCompany(state, action) {
	const { cno } = action.payload;
	const newAuth = { ...state.auth, last_access_company_no: cno };
	console.log('newAuth : ', newAuth);
	return {
		...state,
		auth: newAuth
	};
};

//#endregion Reducer Functions

//#region Export

const actionCreators = {
	login,
	loginRequest,
	loginCheckRequest,
	logout,
	token,
	// tokenLogin,
	agreement,
	intro,
	changeCompany
};

export { actionCreators };
export default reducer;

//#endregion Export
