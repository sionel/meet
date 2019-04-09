//#region Action Types

// MAIN_USER 설정
const SET_MAIN_USER = 'SET_MAIN_USER';

// 메인유저가 없을때만 MAIN_USER 설정
const SET_MAIN_USER_NOTEXIST = 'SET_MAIN_USER_NOTEXIST';

// 드로잉모드
const SET_DRAWING_MODE = 'SET_DRAWING_MODE';

//#endregion Action Types

//#region Initial State

const initialState = {
	mainUserId: null,
	drawingMode: false
};

//#endregion

//#region reducer

function reducer(state = initialState, action) {
	switch (action.type) {
		case SET_MAIN_USER:
			return applySetMainUser(state, action);
		case SET_MAIN_USER_NOTEXIST:
			return applySetMainUserNotExist(state, action);
		case SET_DRAWING_MODE:
			return applySetDrawingMode(state, action);
		default:
			return state;
	}
}

//#endregion

//#region SET_MAIN_USER

function setMainUser(mainUserId) {
	return dispatch => {
		dispatch({
			type: SET_MAIN_USER,
			mainUserId
		});
	};
}

function applySetMainUser(state, action) {
	const { mainUserId } = action;
	return {
		...state,
		mainUserId
	};
}

//#endregion

//#region SET_MAIN_USER_NOTEXIST

function setMainUserNotExist(mainUserId) {
	return (dispatch, getState) => {
		if (!getState().mainUser.mainUserId) {
			dispatch({
				type: SET_MAIN_USER_NOTEXIST,
				mainUserId
			});
		}
	};
}

function applySetMainUserNotExist(state, action) {
	const { mainUserId } = action;
	return {
		...state,
		mainUserId
	};
}

//#endregion

//#region SET_DRAWING_MODE

function setDrawingMode(drawingMode) {
	return dispatch => {
		dispatch({
			type: SET_DRAWING_MODE,
			drawingMode
		});
	};
}

function applySetDrawingMode(state, action) {
	const { drawingMode } = action;
	return {
		...state,
		// drawingMode: !state.drawingMode
		drawingMode: action.drawingMode
	};
}

//#endregion

export const actionCreators = {
	setMainUser,
	setMainUserNotExist,
	setDrawingMode
};

export default reducer;
