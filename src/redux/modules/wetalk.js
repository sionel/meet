/**
 * user
 * user 스토어
 */

import { UserApi } from '../../services';

const SET_LIST = 'SET_LIST';

//#region Action Creators

/**
 * setList
 */
setList = list => {
	return {
		type: SET_LIST,
		list
	};
};

//#endregion

//#region initialState

const initialState = {
	list: []
};

//#endregion initialState

//#region Reducer

reducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_LIST:
			return { ...state, list: action.list };
		default:
			return state;
	}
};

//#endregion Reducer

//#region Export

const actionCreators = {
	setList
};

export { actionCreators };
export default reducer;

//#endregion Export
