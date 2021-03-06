import { ConferenceModes, FacingModes } from '../../utils/Constants';
import { getConferenceManager } from '../../utils/ConferenceManager';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../configureStore';
//#region Action Types

// JOIN_CONFERENCE
const JOIN_CONFERENCE = 'local.JOIN_CONFERENCE';

// LEAVE_CONFERENCE
const LEAVE_CONFERENCE = 'local.LEAVE_CONFERENCE';

// SET_CONFERENCE_MODE
const SET_CONFERENCE_MODE = 'local.SET_CONFERENCE_MODE';

// TOGGLE_MUTE_VIDEO
const TOGGLE_MUTE_VIDEO = 'local.TOGGLE_MUTE_VIDEO';

// TOGGLE_MUTE_AUDIO
const TOGGLE_MUTE_MIC = 'local.TOGGLE_MUTE_MIC';

// TOGGLE_MUTE_SPEAKER
const TOGGLE_MUTE_SPEAKER = 'local.TOGGLE_MUTE_SPEAKER';

// TOGGLE_CAMERA_FACING_MODE
const TOGGLE_CAMERA_FACING_MODE = 'local.TOGGLE_CAMERA_FACING_MODE';

// SET_CONFERENCE_CREATED_TIME
const SET_CONFERENCE_CREATED_TIME = 'local.SET_CONFERENCE_CREATED_TIME';

// SET_CONFERENCE_EXPIRE_TIME
const SET_CONFERENCE_EXPIRE_TIME = 'local.SET_CONFERENCE_EXPIRE_TIME';

// CONFERENCE_MESSAGE_RECEIVED
const CONFERENCE_MESSAGE_RECEIVED = 'local.CONFERENCE_MESSAGE_RECEIVED';

// CONFERENCE_PIP_MODE
const CONFERENCE_PIP_MODE = 'local.CONFERENCE_PIP_MODE';

const SET_EXTERNAL = 'local.SET_EXTERNAL';

const SET_TRACK = 'local.SET_TRACK';

//#endregion Action Types

export interface state {
  user: any;
  conferenceMode: string;
  facingMode: string;
  prevVolumn: any;
  createdTime: number | null;
  expireTime: number | null;
  callType: string | null;
  message: any[];
  pipMode: boolean;
  externalAPIScope: string;
}

//#region Initial State

const initialState = {
  user: null,
  conferenceMode: ConferenceModes.NORMAL,
  facingMode: FacingModes.FRONT,
  prevVolumn: null,
  createdTime: null,
  expireTime: null,
  callType: null,
  message: [],
  pipMode: false,
  externalAPIScope: ''
};

//#endregion

//#region reducer

function reducer(state = initialState, action: AnyAction) {
  switch (action.type) {
    case JOIN_CONFERENCE:
      return applyJoinConference(state, action);
    case LEAVE_CONFERENCE:
      return applyLeaveConference(state);
    case SET_CONFERENCE_MODE:
      return applySetConferenceMode(state, action);
    case TOGGLE_MUTE_VIDEO:
      return applyToggleMuteVideo(state, action);
    case TOGGLE_CAMERA_FACING_MODE:
      return applyToggleCameraFacingMode(state);
    // case TOGGLE_CAMERA_FACING_MODE:
    //   return applyToggleCameraFacingMode(state, action);
    case TOGGLE_MUTE_MIC:
      return applyToggleMuteMic(state, action);
    case TOGGLE_MUTE_SPEAKER:
      return applyToggleMuteSpeaker(state, action);
    case SET_CONFERENCE_CREATED_TIME:
      return applySetConferenceCreatedTime(state, action);
      case SET_CONFERENCE_EXPIRE_TIME:
        return applySetConferenceExpireTime(state, action);
    case CONFERENCE_MESSAGE_RECEIVED:
      return applySetConferenceMessage(state, action);
    case CONFERENCE_PIP_MODE:
      return applySetConferencePIPMode(state, action);
    case SET_EXTERNAL:
      return { ...state, externalAPIScope: action.externalAPIScope };
    case SET_TRACK:
      return applySetTrack(state, action);
    default:
      return state;
  }
}

//#endregion

function setTrack(track: object) {
  return {
    type: SET_TRACK,
    track
  };
}

function applySetTrack(state: state, action: AnyAction) {
  const { user } = state;
  user.videoTrack = action.track;
  user.isMuteVideo = action.track?.isMuted();
  return { ...state, user };
}

//#region JOIN_CONFERENCE

function joinConference(
  conferenceInfo: object
): ThunkAction<void, RootState, unknown> {
  return (dispatch, getState) => {
    const { auth } = getState()['user'];
    dispatch({
      type: JOIN_CONFERENCE,
      conferenceInfo,
      auth
    });
  };
}

function applyJoinConference(state: state, action: AnyAction) {
  const { conferenceInfo } = action;
  const user = {
    id: 'localUser',
    cid: conferenceInfo.cid,
    name: conferenceInfo.name,
    isLocal: true,
    videoTrack: conferenceInfo.videoTrack,
    audioTrack: conferenceInfo.audioTrack,
    isMuteMic: conferenceInfo.audioTrack.isMuted(),
    isMuteVideo: conferenceInfo.videoTrack.isMuted(),
    isMuteSpeaker: false,
    userInfo: {
      isLocal: true,
      userName: conferenceInfo.name,
      nickname: conferenceInfo.nickname
    }
  };
  return {
    ...state,
    user,
    callType: '3' // ???????
  };
}

//#endregion

//#region LEAVE_CONFERENCE

function leaveConference(): ThunkAction<void, RootState, unknown> {
  return dispatch => {
    dispatch({
      type: LEAVE_CONFERENCE
    });
  };
}

function applyLeaveConference(state: state) {
  /** video/audio mute */
  // state.user.videoTrack.dispose();
  // state.user.audioTrack.dispose();
  const user = null;
  return {
    ...state,
    user,
    conferenceMode: ConferenceModes.NORMAL,
    createdTime: null,
    callType: null,
    message: [],
    pipMode: false
  };
}

//#endregion

//#region SET_CONFERENCE_MODE

function setConferenceMode(
  conferenceMode: string
): ThunkAction<void, RootState, unknown> {
  return dispatch => {
    dispatch({
      type: SET_CONFERENCE_MODE,
      conferenceMode
    });
  };
}

function applySetConferenceMode(state: state, action: AnyAction) {
  const { conferenceMode } = action;
  return {
    ...state,
    conferenceMode
  };
}

//#endregion

//#region TOGGLE_MUTE_VIDEO

function toggleMuteVideo(
  videoMute: boolean
): ThunkAction<void, RootState, unknown> {
  return dispatch => {
    dispatch({
      type: TOGGLE_MUTE_VIDEO,
      videoMute
    });
  };
}

function applyToggleMuteVideo(state: state, action: AnyAction) {
  const { user } = state;
  const { videoMute } = action;

  if (user && user.videoTrack) {
    const currentMute =
      typeof videoMute === 'undefined' ? user.isMuteVideo : !videoMute;
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

function toggleCameraFacingMode(): ThunkAction<void, RootState, unknown> {
  return dispatch => {
    dispatch({
      type: TOGGLE_CAMERA_FACING_MODE
    });
  };
}

function applyToggleCameraFacingMode(state: state) {
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

function toggleMuteMic(micMute: any): ThunkAction<void, RootState, unknown> {
  return dispatch => {
    dispatch({
      type: TOGGLE_MUTE_MIC,
      micMute
    });
  };
}

function applyToggleMuteMic(state: state, action: AnyAction) {
  const { user } = state;
  const { micMute } = action;
  if (user && user.audioTrack) {
    const currentMute =
      typeof micMute === 'undefined' ? user.isMuteMic : !micMute;
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
//TODO: ?????? ????????? ??????.
function toggleMuteSpeaker(
  speakerMute: any
): ThunkAction<void, RootState, unknown> {
  return async dispatch => {
    dispatch({
      type: TOGGLE_MUTE_SPEAKER,
      speakerMute
    });
  };
}

function applyToggleMuteSpeaker(state: state, action: AnyAction) {
  const { user } = state;
  const { speakerMute } = action;
  const currentMute =
    typeof speakerMute === 'undefined' ? !user.isMuteSpeaker : !speakerMute;
  return {
    ...state,
    user: {
      ...user,
      isMuteSpeaker: currentMute
    }
  };
}

//#endregion TOGGLE_MUTE_SPEAKER

//#region SET_CONFERENCE_CREATED_TIME

function setConferenceCreatedTime(
  createdTime: number | null
): ThunkAction<void, RootState, unknown> {
  return async dispatch => {
    dispatch({
      type: SET_CONFERENCE_CREATED_TIME,
      createdTime
    });
  };
}

function applySetConferenceCreatedTime(state: state, action: AnyAction) {
  const { createdTime } = action;
  return {
    ...state,
    createdTime: createdTime
  };
}

//#endregion SET_CONFERENCE_CREATED_TIME

//#region SET_CONFERENCE_EXPIRE_TIME

function setConferenceExpireTime(expireTime: number | null): ThunkAction<void, RootState, unknown> {
  return async dispatch => {
    dispatch({
      type: SET_CONFERENCE_EXPIRE_TIME,
      expireTime
    });
  };
}

function applySetConferenceExpireTime(state: state, action: AnyAction) {
  const { expireTime } = action;
  return {
    ...state,
    expireTime: expireTime
  };
}

//#endregion SET_CONFERENCE_EXPIRE_TIME

//#region  CONFERENCE_MESSAGE_RECEIVED
function receiceConferenceMessage(
  newMessage = null
): ThunkAction<void, RootState, unknown> {
  return async (dispatch, getState) => {
    dispatch({
      type: CONFERENCE_MESSAGE_RECEIVED,
      newMessage,
      participants: getState().participants.list
    });
  };
}

function applySetConferenceMessage(state: state, action: AnyAction) {
  const { newMessage, participants } = action;
  const { user } = state;

  if (newMessage === null) {
    return {
      ...state,
      message: []
    };
  }

  const list = state.message.slice(0);
  let message_user =
    newMessage.user === user.cid
      ? user
      : participants.find((participant: any) => {
          return participant.id === newMessage.user;
        }) || { name: '(????????????)' };

  list.push({
    ...newMessage,
    name: message_user.name,
    userInfo: message_user.userInfo
  });

  return {
    ...state,
    message: list
  };
}
//#endregion

function applySetConferencePIPMode(state: state, action: AnyAction) {
  const { pipMode } = action;
  return {
    ...state,
    pipMode
  };
}

export const actionCreators = {
  setConferenceMode,
  joinConference,
  leaveConference,
  toggleMuteVideo,
  toggleCameraFacingMode,
  toggleMuteMic,
  toggleMuteSpeaker,
  setConferenceCreatedTime,
  setConferenceExpireTime,
  receiceConferenceMessage,
  setTrack
};

export default reducer;
