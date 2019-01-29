import ConferenceManager from "../../utils/conference/ConferenceManager";

//#region Action Types

// MAIN_USER 설정
const SET_MAIN_USER = "SET_MAIN_USER";

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
    default:
      return state;
  }
}

//#endregion

//#region SET_MAIN_USER

function setMainUser(mainUserId) {
  const conferenceManager = new ConferenceManager();
  conferenceManager.selectParticipant(mainUserId);
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

export const actionCreators = {
  setMainUser
};

export default reducer;
