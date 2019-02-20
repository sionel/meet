//#region Action Types

// MAIN_USER 설정
const SET_MAIN_USER = "SET_MAIN_USER";

// 메인유저가 없을때만 MAIN_USER 설정
const SET_MAIN_USER_NOTEXIST = "SET_MAIN_USER_NOTEXIST";

//#endregion Action Types

//#region Initial State

const initialState = {
  mainUserId: null
};

//#endregion

//#region reducer

function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_MAIN_USER:
      return applySetMainUser(state, action);
    case SET_MAIN_USER_NOTEXIST:
      return applySetMainUserNotExist(state, action);
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

export const actionCreators = {
  setMainUser,
  setMainUserNotExist
};

export default reducer;
