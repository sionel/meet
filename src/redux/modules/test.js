/**
 * test.js
 * 추후 삭제 요망
 */

const TEST = 'TEST';

//#region Action Creators

/**
 * Test : Test를 위한 Functoin
 */
test = test => {
	console.log(1111111123);

	return {
		type: LOG_IN,
		test
	};
};

//#endregion

//#region initialState

const initialState = {
	test: null
};

//#endregion initialState

//#region Reducer

reducer = (state = initialState, action) => {
	switch (action.type) {
		case TEST:
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
	test
};

export { actionCreators };
export default reducer;

//#endregion Export
