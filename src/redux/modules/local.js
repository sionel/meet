import { ConferenceModes, FacingModes } from '../../utils/Constants';
import { getConferenceManager } from '../../utils/ConferenceManager';
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

// CONFERENCE_MESSAGE_RECEIVED
const CONFERENCE_MESSAGE_RECEIVED = 'local.CONFERENCE_MESSAGE_RECEIVED';

// CONFERENCE_PIP_MODE
const CONFERENCE_PIP_MODE = 'local.CONFERENCE_PIP_MODE';

// 추후 마스터 권한이 생기고 업데이트 된다면 따로 리덕스를 분리하는게 좋을 듯
// 마스터가 컨트롤 하는지에 대한 여부
const SET_IS_CONTROL = 'local.SET_IS_CONTROL';

const SET_AUDIO_ACTIVE = 'local.SET_AUDIO_ACTIVE';

const TOGGLE_MUTE_MIC_MASTER = 'local.TOGGLE_MUTE_MIC_MASTER';

// 마스터 제어중일때 내가 내 마이크 종료하는 경우
const TOGGLE_MUTE_MIC_BY_ME = 'local.TOGGLE_MUTE_MIC_BY_ME';

const TOAST_MESSAGE = 'local.TOAST_MESSAGE';

const SPEEK_REQUEST = 'local.SPEEK_REQUEST';

//#endregion Action Types

//#region Initial State

const initialState = {
  user: null,
  conferenceMode: ConferenceModes.NORMAL,
  facingMode: FacingModes.FRONT,
  prevVolumn: null,
  createdTime: null,
  callType: null,
  message: [],
  pipMode: false,
  isMasterControl: false, // 제어
  isAudioActive: true, // 마이크 활성화
  isMasterMicControl: false, // 마스터가 켜고 껐는지
  isMicRequest: false,
  messageFlag: false,
  toastMessage: ''
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
    case CONFERENCE_MESSAGE_RECEIVED:
      return applySetConferenceMessage(state, action);
    case CONFERENCE_PIP_MODE:
      return applySetConferencePIPMode(state, action);

    case SET_IS_CONTROL:
      return setIsContorl(state, action);
    case SET_AUDIO_ACTIVE:
      return setAudioActive(state, action);

    case TOGGLE_MUTE_MIC_MASTER:
      return applyToggleMuteMicMaster(state, action);
    case TOGGLE_MUTE_MIC_BY_ME:
      return applyToggleMuteMicByMe(state, action);
    case TOAST_MESSAGE:
      return {
        ...state,
        messageFlag: !state.messageFlag,
        toastMessage: action.toastMessage
      };
    case SPEEK_REQUEST:
      return applyToggleMicRequest(state, action);
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
    isAudioActive: true,
    isMasterControl: false,
    isMasterMicControl: false,
    isMicRequest: false,
    callType: conferenceInfo.callType // 삭제?
  };
}

//#endregion

function setMicRequest(flag = null) {
  return dispatch => {
    dispatch({
      type: SPEEK_REQUEST,
      flag
    });
  };
}

function applyToggleMicRequest(state, action) {
  const { flag } = action;
  return {
    ...state,
    isMicRequest: flag !== null ? flag : !state.isMicRequest
  };
}
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
    conferenceMode: ConferenceModes.NORMAL,
    createdTime: null,
    callType: null,
    message: [],
    pipMode: false
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

function toggleMuteVideo(videoMute) {
  return dispatch => {
    dispatch({
      type: TOGGLE_MUTE_VIDEO,
      videoMute
    });
  };
}

function applyToggleMuteVideo(state, action) {
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

function toggleMuteMic(micMute) {
  return dispatch => {
    dispatch({
      type: TOGGLE_MUTE_MIC,
      micMute
    });
  };
}

function applyToggleMuteMic(state, action) {
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
      },
      isMasterMicControl: false,
      isMicRequest: false
    };
  }

  return {
    ...state
  };
}

//#endregion TOGGLE_MUTE_MIC

//#region
function toggleMuteMicByMe(micMute) {
  return dispatch => {
    dispatch({
      type: TOGGLE_MUTE_MIC_BY_ME,
      micMute
    });
  };
}

function applyToggleMuteMicByMe(state, action) {
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

//#endregion

//#region TOGGLE_MUTE_SPEAKER

function toggleMuteSpeaker(speakerMute) {
  return async dispatch => {
    dispatch({
      type: TOGGLE_MUTE_SPEAKER,
      speakerMute
    });
  };
}

function applyToggleMuteSpeaker(state, action) {
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

//#region  CONFERENCE_MESSAGE_RECEIVED
function receiceConferenceMessage(newMessage = null) {
  return async (dispatch, getState) => {
    dispatch({
      type: CONFERENCE_MESSAGE_RECEIVED,
      newMessage,
      participants: getState().participants.list
    });
  };
}

function applySetConferenceMessage(state, action) {
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
      : participants.find(participant => {
          return participant.id === newMessage.user;
        }) || { name: '(알수없음)' };

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

function applySetConferencePIPMode(state, action) {
  const { pipMode } = action;
  return {
    ...state,
    pipMode
  };
}

//#region  SET_IS_CONTROL (마스터가 제어모드 중인지 아닌지)
function changeMasterControlMode(id) {
  return dispatch => {
    dispatch({
      type: SET_IS_CONTROL,
      flag: id ? true : false
    });
  };
}

function setIsContorl(state, action) {
  return {
    ...state,
    isMasterControl: action.flag,
    isMicRequest: false
  };
}
//#endregion

//#region SET_AUDIO_ACTIVE (마스터가 전체마이크 활성화인지 아닌지)

function changeAudioActive(flag) {
  return dispatch => {
    dispatch({
      type: SET_AUDIO_ACTIVE,
      flag
    });
  };
}

function setAudioActive(state, action) {
  const { user } = state;
  const { flag } = action;
  if (user && user.audioTrack) {
    if (flag) {
      user.audioTrack.mute();
    } else {
      user.audioTrack.unmute();
    }
    return {
      ...state,
      user: {
        ...user,
        isMuteMic: flag
      },
      isAudioActive: !flag, // 비활성화가 mute 임
      isMasterMicControl: true,
      isMicRequest: false
    };
  }
}

//#endregion

//#region TOGGLE_MUTE_MIC_MASTER

function changeMuteMicMaster(micMuteFlag) {
  return dispatch => {
    dispatch({
      type: TOGGLE_MUTE_MIC_MASTER,
      micMuteFlag
    });
  };
}

function applyToggleMuteMicMaster(state, action) {
  const { user, isAudioActive } = state;
  const { micMuteFlag } = action;
  if (user && user.audioTrack) {
    if (micMuteFlag) {
      user.audioTrack.mute();
      // REFACT: 꼭 수정했으면 좋겠따 싶은 부분
      // 컨넥터에는 리덕스 받지 않음 그런데 이 isaudioactive로 상태체크 해야하는게 있다보니 매개변수지옥 vs 스파게티중
      // 스파게티를 선택하게 됨
      if (!isAudioActive) getConferenceManager().stopAttention();
    } else {
      user.audioTrack.unmute();
      // if (!isAudioActive) getConferenceManager.requestAttention();
    }
    return {
      ...state,
      user: {
        ...user,
        isMuteMic: micMuteFlag
      },
      // isAudioActive: !micMuteFlag,
      isMasterMicControl: true,
      isMicRequest: false
    };
  }

  return {
    ...state
  };
}

//#endregion

//#region  toastMessage

function setToastMessage(toastMessage) {
  return dispatch => {
    dispatch({
      type: TOAST_MESSAGE,
      toastMessage
    });
  };
}
//#endregion

export const actionCreators = {
  setConferenceMode,
  joinConference,
  leaveConference,
  toggleMuteVideo,
  toggleCameraFacingMode,
  toggleMuteMic,
  toggleMuteSpeaker,
  setConferenceCreatedTime,
  receiceConferenceMessage,
  changeMasterControlMode,
  changeMuteMicMaster,
  toggleMuteMicByMe,
  setToastMessage,
  changeAudioActive,
  setMicRequest
};

export default reducer;
