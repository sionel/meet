import { actionCreators as mainUserActionCreators } from "./mainUser";
//#region Action Types

// 새참여자 회의 참가
const JOIN_USER = "JOIN_USER";

// 참여자 나가기
const LEFT_USER = "LEFT_USER";

// 참여자의 트랙 추가
const SET_REMOTE_TRACK = "SET_REMOTE_TRACK";

// UPDATE_MUTE_VIDEO
const UPDATE_MUTE_VIDEO = "UPDATE_MUTE_VIDEO";

//#endregion Action Types

//#region Initial State

const initialState = {
  list: []
};

//#endregion

//#region reducer

function reducer(state = initialState, action) {
  switch (action.type) {
    case JOIN_USER:
      return applyJoinUser(state, action);
    case LEFT_USER:
      return applyLeftUser(state, action);
    case SET_REMOTE_TRACK:
      return applySetRemoteTrack(state, action);
    case UPDATE_MUTE_VIDEO:
      return applyUpdateMuteVideo(state, action);
    default:
      return state;
  }
}

//#endregion

//#region JOIN_USER : 새로운 유저 참가

function joinUser(user) {
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

function applyJoinUser(state, action) {
  const { user } = action;
  const list = state.list.slice(0);
  const participant = {
    id: user.getId(),
    isLocal: false,
    name: user.getDisplayName(),
    isMuteVideo: false,
    videoTrack: null,
    audioTrack: null
  };
  list.push(participant);
  return {
    ...state,
    list
  };
}

//#endregion JOIN_USER

//#region LEFT_USER : 새로운 유저 참가

function leftUser(id) {
  return (dispatch, getState) => {
    // 나가는 사람이 현재 메인이라면 메인을 변경
    const mainUser = getState().mainUser;
    if (mainUser.mainUserId === id) {
      dispatch(mainUserActionCreators.setMainUser("localUser"));
    }
    dispatch({
      type: LEFT_USER,
      id
    });
  };
}

function applyLeftUser(state, action) {
  const { id } = action;
  const list = state.list.filter(participant => participant.id !== id);

  return {
    ...state,
    list
  };
}

//#endregion LEFT_USER

//#region SET_REMOTE_TRACK

function setRemoteTrack(track) {
  return dispatch => {
    dispatch({
      type: SET_REMOTE_TRACK,
      track
    });
  };
}

function applySetRemoteTrack(state, action) {
  const { track } = action;
  const id = track.getParticipantId();
  const list = state.list.slice(0);
  const findUser = list.find(user => user.id === id);
  if (findUser) {
    const type = track.getType();
    if (type === "video") {
      findUser.videoTrack = track;
    } else if (type === "audio") {
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

function updateMuteVideo(track) {
  return dispatch => {
    dispatch({
      type: UPDATE_MUTE_VIDEO,
      track
    });
  };
}

function applyUpdateMuteVideo(state, action) {
  const { track } = action;
  const list = state.list.slice(0);
  const findUser = list.find(user => {
    if (user.videoTrack && user.id === track.getParticipantId()) {
      return true;
    }
    return false;
  });
  if (findUser) {
    findUser.isMuteVideo = track.isMuted();
  }

  return {
    ...state,
    list
  };
}

//#endregion UPDATE_MUTE_VIDEO

export const actionCreators = {
  joinUser,
  leftUser,
  setRemoteTrack,
  updateMuteVideo
};

export default reducer;
