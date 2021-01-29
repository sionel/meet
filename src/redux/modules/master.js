//#region master

import MeetApi from '../../services/api/MeetApi';

const UPDATE_MASTER_LIST = 'master.UPDATE_MASTER_LIST';

// 추후 마스터 권한이 생기고 업데이트 된다면 따로 리덕스를 분리하는게 좋을 듯
// 마스터가 컨트롤 하는지에 대한 여부
const SET_IS_CONTROL = 'master.SET_IS_CONTROL';

const SET_AUDIO_ACTIVE = 'master.SET_AUDIO_ACTIVE';

const TOGGLE_MUTE_MIC_MASTER = 'master.TOGGLE_MUTE_MIC_MASTER';

// 마스터 제어중일때 내가 내 마이크 종료하는 경우
const TOGGLE_MUTE_MIC_BY_ME = 'master.TOGGLE_MUTE_MIC_BY_ME';

const TOAST_MESSAGE = 'master.TOAST_MESSAGE';

const SPEEK_REQUEST = 'master.SPEEK_REQUEST';

const initialState = {
  masterList: [],
  isMasterControl: false, // 제어
  isAudioActive: true, // 마이크 활성화
  isMasterMicControl: false // 마스터가 켜고 껐는지
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_MASTER_LIST:
      return updateMasterList(state, action);

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

//#region 마스터 리스트
function checkMasterList(token) {
  if (!token) {
  }
  return async dispatch => {
    const result = await MeetApi.getMasterList(token);
    if (!result) {
    }

    const masterList = result.resultData.reduce((a, b) => {
      a.push(b.user);
      return a;
    }, []);
    dispatch({
      type: UPDATE_MASTER_LIST,
      masterList
    });
  };
}

function updateMasterList(state, action) {
  return {
    ...state,
    masterList: action.masterList
  };
}
//#endregion

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

//#region TOGGLE_MUTE_MIC_BY_ME
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

//#region SPEEK_REQUEST
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
  checkMasterList,
  changeMasterControlMode,
  changeAudioActive,
  changeMuteMicMaster,
  toggleMuteMicByMe,
  setToastMessage,
  setMicRequest
};

export default reducer;

//#endregion
