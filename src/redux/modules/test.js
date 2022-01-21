/**
 * test.js
 * 추후 삭제 요망
 */
import { UserApi } from '@services/index';

const TEST = 'TEST';
const POSTS = 'POSTS';
const ERROR = 'ERROR';

//#region Action Creators

export const getPosts = () => {
	return dispatch => {
		UserApi.test()
			.then(resp => {
				dispatch(test(resp));
			})
			.catch(err => {
				alert('Error');
				return;
			});
	};
};

/**
 * Test : Test를 위한 Functoin
 */
posts = posts => {
	return {
		type: POSTS,
		test
	};
};

/**
 * Test : Test를 위한 Functoin
 */
error = () => {
	return {
		type: ERROR
	};
};

//#endregion

//#region initialState

const initialState = {
	posts: null
};

//#endregion initialState

//#region Reducer

reducer = (state = initialState, action) => {
	switch (action.type) {
		case TEST:
			return applyTest(state, action);
		case POSTS:
			return applyTest(state, action);
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
	posts,
	error
};

export { actionCreators };
export default reducer;

//#endregion Export
