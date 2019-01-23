/**
 * user
 * user 스토어
 */

import { UserApi } from '../../services';

const LOGIN = 'LOGIN';

//#region Action Creators

/**
 * login
 */
login = auth => {
	return {
		type: LOGIN,
		auth
	};
};

//#endregion

//#region initialState

const initialState = {
	auth: null
};

//#endregion initialState

//#region Reducer

reducer = (state = initialState, action) => {
	switch (action.type) {
		case LOGIN:
			return { ...state, auth: action.auth };
		// return applyTest(state, action);
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

//#endregion Reducer Functions

//#region Export

const actionCreators = {
	login
};

export { actionCreators };
export default reducer;

//#endregion Export
