//#region master

import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import MeetApi from '../../services/api/MeetApi';
import { RootState } from '../configureStore';

//#region Action.type

const UPDATE_MASTER_LIST = 'master.UPDATE_MASTER_LIST';

// 추후 마스터 권한이 생기고 업데이트 된다면 따로 리덕스를 분리하는게 좋을 듯
// 마스터가 컨트롤 하는지에 대한 여부
const SET_IS_CONTROL = 'master.SET_IS_CONTROL';

const SET_AUDIO_ACTIVE = 'master.SET_AUDIO_ACTIVE';

const TOGGLE_MUTE_MIC_MASTER = 'master.TOGGLE_MUTE_MIC_MASTER';

const NO_WHERE_MASTER = 'master.NO_WHERE_MASTER';

// 마스터 제어중일때 내가 내 마이크 종료하는 경우
const TOGGLE_MUTE_MIC_BY_ME = 'master.TOGGLE_MUTE_MIC_BY_ME';

const TOAST_MESSAGE = 'master.TOAST_MESSAGE';

const SPEEK_REQUEST = 'master.SPEEK_REQUEST';
//#endregion

export interface state {
  masterList: string[];
  isMasterControl: boolean; // 제어
  isAudioActive: boolean; // 마이크 활성화
  isMasterMicControl: boolean; // 마스터가 켜고 껐는지
  isMicRequest: boolean;
}
//#region initState
const initialState = {
  masterList: [],
  isMasterControl: false, // 제어
  isAudioActive: true, // 마이크 활성화
  isMasterMicControl: false, // 마스터가 켜고 껐는지
  isMicRequest: false
};
//#endregion

//#region reducer
function reducer(state = initialState, action: AnyAction) {
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
    case SPEEK_REQUEST:
      return applyToggleMicRequest(state, action);
    default:
      return state;
  }
}
//#endregion
//#region 마스터 리스트
function checkMasterList(token: string): ThunkAction<void, RootState, unknown> {
  
  return async dispatch => {
    const result = await MeetApi.getMasterList(token);
    if (!result) {
    }

    const masterList = result.resultData.reduce((a: any[], b:any) => {
      a.push(b.user);
      return a;
    }, []);
    dispatch({
      type: UPDATE_MASTER_LIST,
      masterList
    });
  };
}

function updateMasterList(state: state, action: AnyAction) {
  return {
    ...state,
    masterList: action.masterList
  };
}
//#endregion

//#region  SET_IS_CONTROL (마스터가 제어모드 중인지 아닌지)
function changeMasterControlMode(id: string): ThunkAction<void, RootState, unknown> {
  
  return dispatch => {
    dispatch({
      type: SET_IS_CONTROL,
      flag: id ? true : false
    });
  };
}

function setIsContorl(state: state, action: AnyAction) {
  return {
    ...state,
    isMasterControl: action.flag,
    isMicRequest: false
  };
}
//#endregion

//#region  SET_IS_CONTROL (마스터가 제어모드 중인지 아닌지)
function noWhereMaster(): ThunkAction<void, RootState, unknown> {
  return (dispatch, getState, extraArgument) => {
    const isMasterControl = getState()['master']['isMasterControl']
    isMasterControl && dispatch({
      type: 'local.TOGGLE_MUTE_MIC',
      micMute: false
    });
    dispatch({
      type: SET_IS_CONTROL,
      flag: false
    });


  };
}

//#endregion

//#region SET_AUDIO_ACTIVE (마스터가 전체마이크 활성화인지 아닌지)

function changeAudioActive(flag: boolean): ThunkAction<void, RootState, unknown> {
  
  return (dispatch, getState, extraArgument) => {
    const user = getState()['local']['user'];
    dispatch({
      type: 'local.TOGGLE_MUTE_MIC',
      micMute: flag
    });
    dispatch({
      type: SET_AUDIO_ACTIVE,
      flag
    });
  };
}

function setAudioActive(state: state, action: AnyAction) {
  const { flag } = action;

  return {
    ...state,
    isAudioActive: !flag, // 비활성화가 mute 임
    isMasterMicControl: true,
    isMicRequest: false
  };
}

//#endregion

//#region TOGGLE_MUTE_MIC_MASTER

function changeMuteMicMaster(micMuteFlag: boolean): ThunkAction<void, RootState, unknown> {
  
  return (dispatch, getState, extraArgument) => {
    dispatch({
      type: 'local.TOGGLE_MUTE_MIC',
      micMute: micMuteFlag
    });

    dispatch({
      type: TOGGLE_MUTE_MIC_MASTER,
      micMuteFlag
    });
  };
}

function applyToggleMuteMicMaster(state: state, action: AnyAction) {
  return {
    ...state,
    isMasterMicControl: true,
    isMicRequest: false
  };
}

//#endregion

//#region TOGGLE_MUTE_MIC_BY_ME
//TODO: 어디서 사용하는지 파악이 안됨.
function toggleMuteMicByMe(micMute: any): ThunkAction<void, RootState, unknown> {
  
  return (dispatch, getState, extraArgument) => {
    const user = getState()['local']['user'];
    dispatch({
      type: TOGGLE_MUTE_MIC_BY_ME,
      micMute,
      user
    });
  };
}

function applyToggleMuteMicByMe(state: state, action: AnyAction) {
  // console.log('state1111');
  // console.log(state);
  
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
function setMicRequest(flag = null): ThunkAction<void, RootState, unknown> {
  return dispatch => {
    dispatch({
      type: SPEEK_REQUEST,
      flag
    });
  };
}

function applyToggleMicRequest(state: state, action: AnyAction) {
  const { flag } = action;
  return {
    ...state,
    isMicRequest: flag !== null ? flag : !state.isMicRequest
  };
}
//#endregion

export const actionCreators = {
  checkMasterList,
  changeMasterControlMode,
  changeAudioActive,
  changeMuteMicMaster,
  toggleMuteMicByMe,
  setMicRequest,
  noWhereMaster
};

export default reducer;

//#endregion
