/**
 * user
 * user 스토어
 */

import { UserApi } from '../../services';

const AGREEMENT = 'AGREEMENT';
const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';
const TOKEN = 'TOKEN';
const TOKEN_LOGIN = 'TOKEN_LOGIN';
const INTRO = 'INTRO';
const CHANGE_COMPANY = 'CHANGE_COMPANY';

//#region Action Creators

/**
 * agreement
 */
agreement = () => {
	return { type: AGREEMENT };
};

/**
 * login
 */
login = auth => {
	return {
		type: LOGIN,
		auth
	};
};

/**
 * logout
 */
logout = auth => {
	return {
		type: LOGIN,
		auth
	};
};

/**
 * tokenTest
 */
token = auth => {
	return {
		type: TOKEN,
		newToken: 100
	};
};

/**
 * intro skip
 */
intro = () => {
	return { type: INTRO };
};

/**
 * CHANGE_COMPANY
 */
changeCompany = cno => {
	return {
		type: CHANGE_COMPANY,
		payload: { cno }
	};
};

/**
 * tokenLogin : ACTION
 */
tokenLogin = (token, cno) => {
	alert('준비중입니다.');
	// return;
	const result = UserApi.check(token, cno);
	console.log('tokenLogin : ', typeof result);

	return dispatch => {
		dispatch({
			type: TOKEN_LOGIN,
			payload: {
				token
			}
		});
	};
};

/**
 * applyTokenLogin
 */
applyTokenLogin = (state, action) => {
	return state;
};

//#endregion

//#region initialState

const initialState = {
	auth: null,
	permission: false,
	intro: false
};

//#endregion initialState

//#region Reducer

reducer = (state = initialState, action) => {
	switch (action.type) {
		case AGREEMENT:
			return { ...state, permission: !state.permission };
		case LOGIN:
			return { ...state, auth: action.auth };
		// return applyTest(state, action);
		case LOGOUT:
			return { ...state, auth: null };
		case TOKEN:
			let aa = state.auth;
			aa.AUTH_A_TOKEN = action.newToken;
			return {
				...state,
				auth: aa
			};
		case TOKEN_LOGIN:
			applyTokenLogin(state, action);
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
applyTest = (state, action) => {
	const { test } = action;
	return {
		...state,
		test
	};
};

/**
 * 
 */
applyChangeCompany = (state, action) => {
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
	logout,
	token,
	tokenLogin,
	agreement,
	intro,
	changeCompany
};

export { actionCreators };
export default reducer;

//#endregion Export
