import { ConferenceModes, FacingModes } from '../../utils/Constants';

//#region Action Types

// JOIN_CONFERENCE
const JOIN_CONFERENCE = 'JOIN_CONFERENCE';

// LEAVE_CONFERENCE
const LEAVE_CONFERENCE = 'LEAVE_CONFERENCE';

// SET_CONFERENCE_MODE
const SET_CONFERENCE_MODE = 'SET_CONFERENCE_MODE';

// TOGGLE_MUTE_VIDEO
const TOGGLE_MUTE_VIDEO = 'TOGGLE_MUTE_VIDEO';

// TOGGLE_MUTE_AUDIO
const TOGGLE_MUTE_MIC = 'TOGGLE_MUTE_MIC';

// TOGGLE_MUTE_SPEAKER
const TOGGLE_MUTE_SPEAKER = 'TOGGLE_MUTE_SPEAKER';

// TOGGLE_CAMERA_FACING_MODE
const TOGGLE_CAMERA_FACING_MODE = 'TOGGLE_CAMERA_FACING_MODE';

// SET_CONFERENCE_CREATED_TIME
const SET_CONFERENCE_CREATED_TIME = 'SET_CONFERENCE_CREATED_TIME';

//#endregion Action Types

//#region Initial State

const initialState = {
  user: null,
  conferenceMode: ConferenceModes.NORMAL,
  facingMode: FacingModes.FRONT,
  prevVolumn: null,
  createdTime: null
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
    case TOGGLE_CAMERA_FACING_MODE:
      return applyToggleCameraFacingMode(state, action);
    case TOGGLE_MUTE_MIC:
      return applyToggleMuteMic(state, action);
    case TOGGLE_MUTE_SPEAKER:
      return applyToggleMuteSpeaker(state, action);
    case SET_CONFERENCE_CREATED_TIME:
      return applySetConferenceCreatedTime(state, action);
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
    audioTrack: conferenceInfo.audioTrack,
    isMuteMic: false,
    isMuteVideo: false,
    isMuteSpeaker: false
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
  /** video/audio mute */
  state.user.videoTrack.mute();
  state.user.audioTrack.mute();

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

function toggleMuteVideo(muteState) {
  return dispatch => {
    dispatch({
      type: TOGGLE_MUTE_VIDEO,
      muteState
    });
  };
}

function applyToggleMuteVideo(state, action) {
  const { user } = state;
  const { muteState } = action;

  if (user && user.videoTrack) {
    const currentMute = !muteState || user.isMuteVideo;
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

//#region TOGGLE_MUTE_MIC

function toggleMuteMic() {
  return dispatch => {
    dispatch({
      type: TOGGLE_MUTE_MIC
    });
  };
}

function applyToggleMuteMic(state) {
  const { user } = state;
  if (user && user.audioTrack) {
    const currentMute = user.isMuteMic;
    if (currentMute) {
      user.audioTrack.unmute();
    } else {
      user.audioTrack.mute();
    }
    return {
      ...state,
      user: {
        ...user,
        isMuteMic: !currentMute
      }
    };
  }

  return {
    ...state
  };
}

//#endregion TOGGLE_MUTE_MIC

//#region TOGGLE_MUTE_SPEAKER

function toggleMuteSpeaker() {
  return async dispatch => {
    dispatch({
      type: TOGGLE_MUTE_SPEAKER
    });
  };
}

function applyToggleMuteSpeaker(state, action) {
  const { user } = state;
  return {
    ...state,
    user: {
      ...user,
      isMuteSpeaker: !user.isMuteSpeaker
    }
  };
}

//#endregion TOGGLE_MUTE_SPEAKER

//#region SET_CONFERENCE_CREATED_TIME

function setConferenceCreatedTime(createdTime) {
  return async dispatch => {
    dispatch({
      type: SET_CONFERENCE_CREATED_TIME,
      createdTime
    });
  };
}

function applySetConferenceCreatedTime(state, action) {
  const { createdTime } = action;
  return {
    ...state,
    createdTime: createdTime
  };
}

//#endregion SET_CONFERENCE_CREATED_TIME

export const actionCreators = {
  setConferenceMode,
  joinConference,
  leaveConference,
  toggleMuteVideo,
  toggleCameraFacingMode,
  toggleMuteMic,
  toggleMuteSpeaker,
  setConferenceCreatedTime
};

export default reducer;
