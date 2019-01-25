import User from "../../models/User";
import { ConferenceModes } from "../../utils/Constants";

//#region Action Types

// JOIN_CONFERENCE
const JOIN_CONFERENCE = "JOIN_CONFERENCE";

// LEAVE_CONFERENCE
const LEAVE_CONFERENCE = "LEAVE_CONFERENCE";

// SET_CONFERENCE_MODE
const SET_CONFERENCE_MODE = "SET_CONFERENCE_MODE";

//#endregion Action Types

//#region Initial State

const initialState = {
  user: null,
  conferenceMode: ConferenceModes.NORMAL
};

//#endregion

//#region reducer

function reducer(state = initialState, action) {
  switch (action.type) {
    case JOIN_CONFERENCE:
      return applyJoinConference(state, action);
    case LEAVE_CONFERENCE:
      return applyLeaveConference(state, action);
    case SET_CONFERENCE_MODE:
      return applySetConferenceMode(state, action);
    default:
      return state;
  }
}

//#endregion

//#region JOIN_CONFERENCE

function joinConference(conferenceInfo) {
  return dispatch => {
    dispatch({
      type: JOIN_CONFERENCE,
      conferenceInfo
    });
  };
}

function applyJoinConference(state, action) {
  const { conferenceInfo } = action;
  const user = new User(
    conferenceInfo.id,
    true,
    conferenceInfo.videoTrack,
    conferenceInfo.audioTrack
  );
  return {
    ...state,
    user
  };
}

//#endregion

//#region LEAVE_CONFERENCE

function leaveConference() {
  return dispatch => {
    dispatch({
      type: LEAVE_CONFERENCE
    });
  };
}

function applyLeaveConference(state) {
  const user = null;
  return {
    ...state,
    user
  };
}

//#endregion

//#region SET_CONFERENCE_MODE

function setConferenceMode(conferenceMode) {
  return dispatch => {
    dispatch({
      type: SET_CONFERENCE_MODE,
      conferenceMode
    });
  };
}

function applySetConferenceMode(state, action) {
  const { conferenceMode } = action;
  return {
    ...state,
    conferenceMode
  };
}

//#endregion

export const actionCreators = {
  setConferenceMode,
  joinConference,
  leaveConference
};

export default reducer;
