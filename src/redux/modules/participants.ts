import { actionCreators as mainUserActionCreators } from './mainUser';
import { actionCreators as localActionCreators } from './local';
import MeetApi from '../../services/api/MeetApi';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../configureStore';
//#region Action Types

// 새참여자 회의 참가
const INIT = 'participants.INIT';

// 새참여자 회의 참가
const JOIN_USER = 'participants.JOIN_USER';

// 참여자 나가기
const LEFT_USER = 'participants.LEFT_USER';

// 참여자의 트랙 추가
const SET_REMOTE_TRACK = 'participants.SET_REMOTE_TRACK';

// UPDATE_MUTE_VIDEO
const UPDATE_MUTE_VIDEO = 'participants.UPDATE_MUTE_VIDEO';

// UPDATE_MUTE_AUDIO
const UPDATE_MUTE_AUDIO = 'participants.UPDATE_MUTE_AUDIO';

// SET_USER_INFO
const SET_USER_INFO = 'participants.SET_USER_INFO';

// SET_USER_INFO
const SET_CHANGED_STATUS = 'participants.SET_CHANGED_STATUS';

// 유저 강퇴
const SET_KICK = 'participants.SET_KICK';

//#endregion Action Types

//#region Initial State
export interface state {
  list: any[]
}
const initialState = {
  list: []
};

//#endregion

//#region reducer

function reducer(state = initialState, action: AnyAction) {
  console.log('state');
  console.log(state);
  
  switch (action.type) {
    case INIT:
      return _initParticipants();
    case JOIN_USER:
      return applyJoinUser(state, action);
    case LEFT_USER:
      return applyLeftUser(state, action);
    case SET_REMOTE_TRACK:
      return applySetRemoteTrack(state, action);
    case UPDATE_MUTE_VIDEO:
      return applyUpdateMuteVideo(state, action);
    // case UPDATE_MUTE_AUDIO:
    //   return applyUpdateMuteAudio(state, action);
    case SET_USER_INFO:
      return applySetUserInfo(state, action);
    case SET_CHANGED_STATUS:
      return applyChangedStatus(state, action);
    // case SET_KICK:
    //   return applySetKickFlag(state, action);
    default:
      return state;
  }
}

//#endregion

function initParticipants() {
  return { type: INIT };
}

function _initParticipants() {
  return { ...initialState };
}

//#region JOIN_USER : 새로운 유저 참가

function joinUser(user: any): ThunkAction<void, RootState, unknown> {
  
  return (dispatch, getState) => {
    const length = getState().participants.list.length;
    dispatch({
      type: JOIN_USER,
      user
    });
    if (length == 0) {
      dispatch(mainUserActionCreators.setMainUser(user.getId()));
    }
  };
}

function applyJoinUser(state: state, action: AnyAction) {
  const { user } = action;
  const list = state.list.slice(0);
  const participant = {
    id: user.getId(),
    isLocal: false,
    name: user.getDisplayName(),
    isMuteVideo: false,
    videoTrack: null,
    audioTrack: null,
    userInfo: null,
    isKicked: false
  };
  list.push(participant);

  return {
    ...state,
    list
  };
}

//#endregion JOIN_USER

/**
 *
 * @param {*} userId
 */
function changedStatus(userId: string, status: any): ThunkAction<void, RootState, unknown> {
  
  return dispatch => {
    dispatch({
      type: SET_CHANGED_STATUS,
      payload: {
        userId,
        status
      }
    });
  };
}
function applyChangedStatus(state: state, action: AnyAction) {
  const { userId, status } = action.payload;
  const userIndex = state.list.findIndex(u => u.id === userId);
  let newList = state.list.slice(0);
  newList[userIndex].status = status;
  return {
    ...state,
    list: newList
  };
}

//#region LEFT_USER : 새로운 유저 참가

function leftUser(id:string): ThunkAction<void, RootState, unknown> {
  
  return (dispatch, getState) => {
    // 나가는 사람이 현재 메인이라면 메인을 변경
    const mainUser = getState().mainUser;
    if (mainUser.mainUserId === id) {
      dispatch(mainUserActionCreators.setMainUser('localUser'));
    }
    dispatch({
      type: LEFT_USER,
      id
    });
  };
}

function applyLeftUser(state: state, action: AnyAction) {
  const { id } = action;
  const list = state.list.filter((participant:any) => participant.id !== id);

  return {
    ...state,
    list
  };
}

//#endregion LEFT_USER

//#region SET_REMOTE_TRACK

function setRemoteTrack(track: any): ThunkAction<void, RootState, unknown> {
  
  return dispatch => {
    dispatch({
      type: SET_REMOTE_TRACK,
      track
    });
  };
}

function applySetRemoteTrack(state: state, action: AnyAction) {
  const { track } = action;
  const id = track.getParticipantId();
  const list = state.list.slice(0);
  const findUser = list.find((user: any) => user.id === id);
  if (findUser) {
    const type = track.getType();
    if (type === 'video') {
      findUser.videoTrack = track;
      findUser.isMuteVideo = track.isMuted();
    } else if (type === 'audio') {
      findUser.audioTrack = track;
    }
  }
  return {
    ...state,
    list
  };
}

//#endregion SET_REMOTE_TRACK

//#region UPDATE_MUTE_VIDEO

function updateMuteVideo(track: any): ThunkAction<void, RootState, unknown> {
  return dispatch => {
    dispatch({
      type: UPDATE_MUTE_VIDEO,
      track
    });
  };
}

function applyUpdateMuteVideo(state: state, action: AnyAction) {
  const { track } = action;
  const list = state.list.slice(0);

  if (track.getType() === 'video') {
    const findUser = list.find((user:any) => {
      if (user.videoTrack && user.id === track.getParticipantId()) {
        return true;
      }
      return false;
    });
    if (findUser) {
      findUser.isMuteVideo = track.isMuted();
    }
  } else if (track.getType() === 'audio') {
    const findUser = list.find((user: any) => {
      if (user.audioTrack && user.id === track.getParticipantId()) {
        return true;
      }
      return false;
    });
    if (findUser) {
      findUser.isMuteAudio = track.isMuted();
    }
  }

  return {
    ...state,
    list
  };
}

//#endregion UPDATE_MUTE_VIDEO

//#region UPDATE_MUTE_AUDIO

// function updateMuteAudio(user) {
//   return dispatch => {
//     dispatch({
//       type: UPDATE_MUTE_AUDIO,
//       user
//     });
//   };
// }

// function applyUpdateMuteAudio(state: state, action: AnyAction) {
//   const { user } = action;
//   const list = state.list.slice(0);

//   const findUser = list.find(item => {
//     if (item.audioTrack && item.id === user.id) {
//       return true;
//     }
//     return false;
//   });
//   if (findUser) {
// 		console.log(findUser.audioTrack)
// 		findUser.audioTrack.stream.onactive()
// 		findUser.audioTrack.muted = !findUser.audioTrack.muted;
// 		findUser.isMuteAudio = findUser.audioTrack.muted;
//     console.log('findUser', findUser);
//   }

//   return {
//     ...state,
//     list
//   };
// }

//#endregion UPDATE_MUTE_AUDIO

//#region SET_USER_INFO

function setUserInfo(id: string, info: any): ThunkAction<void, RootState, unknown> {
  
  return dispatch => {
    dispatch({
      type: SET_USER_INFO,
      id,
      info
    });
  };
}

function applySetUserInfo(state: state, action: AnyAction) {
  const { id, info } = action;
  const list = state.list.slice(0);
  const findUser = list.find((user:any) => {
    // WEHAGO_ID로 sendCommand 받는데 이상한 로직에서도 받는게 있어서 중복처리 하려고 둔 로직
    if (user.id === id) {
      return true;
    }
    return false;
  });

  if (findUser) {
    findUser.userInfo = info;
  }

  return {
    ...state,
    list
  };
}

//#endregion SET_USER_INFO

export const actionCreators = {
  joinUser,
  leftUser,
  setRemoteTrack,
  updateMuteVideo,
  // updateMuteAudio,
  setUserInfo,
  changedStatus,
  initParticipants
};

export default reducer;
