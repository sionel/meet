import { ConferenceModes, FacingModes } from "../../utils/Constants";

//#region Action Types

// JOIN_CONFERENCE
const JOIN_CONFERENCE = "JOIN_CONFERENCE";

// LEAVE_CONFERENCE
const LEAVE_CONFERENCE = "LEAVE_CONFERENCE";

// SET_CONFERENCE_MODE
const SET_CONFERENCE_MODE = "SET_CONFERENCE_MODE";

// TOGGLE_MUTE_AUDIO
const TOGGLE_MUTE_VIDEO = "TOGGLE_MUTE_VIDEO";

// TOGGLE_CAMERA_FACING_MODE
const TOGGLE_CAMERA_FACING_MODE = "TOGGLE_CAMERA_FACING_MODE";

//#endregion Action Types

//#region Initial State

const initialState = {
  user: null,
  conferenceMode: ConferenceModes.NORMAL,
  facingMode: FacingModes.FRONT
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
    case TOGGLE_MUTE_VIDEO:
      return applyToggleMuteVideo(state, action);
    case TOGGLE_CAMERA_FACING_MODE:
      return applyToggleCameraFacingMode(state, action);
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
  const user = {
    id: conferenceInfo.id,
    name: conferenceInfo.name,
    isLocal: true,
    videoTrack: conferenceInfo.videoTrack,
    audioTrack: conferenceInfo.audioTrack
  };
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
    user,
    conferenceMode: ConferenceModes.NORMAL
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

//#region TOGGLE_MUTE_VIDEO

function toggleMuteVideo() {
  return dispatch => {
    dispatch({
      type: TOGGLE_MUTE_VIDEO
    });
  };
}

function applyToggleMuteVideo(state, action) {
  const { user } = state;
  if (user && user.videoTrack) {
    const currentMute = user.isMuteVideo;
    if (currentMute) {
      user.videoTrack.unmute();
    } else {
      user.videoTrack.mute();
    }
    return {
      ...state,
      user: {
        ...user,
        isMuteVideo: !currentMute
      }
    };
  }
  return state;
}

//#endregion

//#region TOGGLE_CAMERA_FACING_MODE

function toggleCameraFacingMode() {
  return dispatch => {
    dispatch({
      type: TOGGLE_CAMERA_FACING_MODE
    });
  };
}

function applyToggleCameraFacingMode(state) {
  const { user, facingMode } = state;
  if (user && user.videoTrack) {
    user.videoTrack._switchCamera();
    if (facingMode === FacingModes.FRONT) {
      return {
        ...state,
        facingMode: FacingModes.BACK
      };
    } else {
      return {
        ...state,
        facingMode: FacingModes.FRONT
      };
    }
  }
  return state;
}

//#endregion

export const actionCreators = {
  setConferenceMode,
  joinConference,
  leaveConference,
  toggleMuteVideo,
  toggleCameraFacingMode
};

export default reducer;
