import { actionCreators as mainUserActionCreators } from './mainUser';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../configureStore';

const JOIN_USER = 'participants_copy.JOIN_USER';
const SET_USER_INFO = 'participants_copy.SET_USER_INFO';
const RESET_USERLIST = 'participants_copy.RESET_USERLIST';
const SET_USER_TRACK = 'participants_copy.SET_USER_TRACK';
const TOGGLE_MUTE_VIDEO = 'participants_copy.TOGGLE_MUTE_VIDEO';

export interface Participant {
  jitsiId: string;
  videoTrack: any;
  audioTrack: any;
  isMaster: boolean;
  name: string;
  nickname: string;
  wehagoId: string;
  avatar: string;
  companyFullpath: string;
  profileUrl: string;
  phonenumber: string;
  email: string;
}
export interface InitialState {
  list: Participant[];
}
const initialState: InitialState = {
  list: []
};

function reducer(state = initialState, action: AnyAction) {
  switch (action.type) {
    // case JOIN_USER:
    //   return _joinUser(state, action);
    case SET_USER_INFO:
      return _setUserInfo(state, action);
    case RESET_USERLIST:
      return _resetUserlist(state);
    case SET_USER_TRACK:
      return _setUserTrack(state, action);
    // case TOGGLE_MUTE_VIDEO:
    //   return _toggleMuteVideo(state);
    default:
      return state;
  }
}

// const joinUser = (user: any): ThunkAction<void, RootState, unknown> => {
//   return dispatch => {
//     dispatch({
//       type: JOIN_USER,
//       user
//     });
//   };
// };
// const _joinUser = (state: InitialState, action: AnyAction) => {
//   const { user } = action;

//   return {
//     ...state
//   };
// };

const setUserInfo = (user: any): ThunkAction<void, RootState, unknown> => {
  return dispatch => {
    dispatch({
      type: SET_USER_INFO,
      user
    });
  };
};
const _setUserInfo = (state: InitialState, action: AnyAction) => {
  const { user } = action;
  const { list } = state;

  if (list.some(({ jitsiId }) => jitsiId === user.value)) return { ...state };
  const avatar = user.attributes.avatar
    ? JSON.parse(user.attributes.avatar).value
    : 'jangok';

  const newUser: Participant = {
    jitsiId: user.value,
    videoTrack: user.attributes.videoTrack,
    audioTrack: user.attributes.audioTrack,
    isMaster: false,
    name: user.attributes.userName,
    nickname: user.attributes?.nickname,
    avatar,
    email: user.attributes?.user_email,
    companyFullpath: user.attributes?.companyFullpath,
    phonenumber: user.attributes?.user_contact,
    profileUrl: user.attributes.profile_url,
    wehagoId: user.attributes?.wehagoId
  };
  list.push(newUser);
  return {
    list
  };
};

const setUserTrack = (track: any): ThunkAction<void, RootState, unknown> => {
  return dispatch => {
    dispatch({
      type: SET_USER_TRACK,
      track
    });
  };
};
const _setUserTrack = (state: InitialState, action: AnyAction) => {
  const { track } = action;
  const { list } = state;
  const trackType = track.getType();
  const index = state.list.findIndex(
    ({ jitsiId }) => track.ownerEndpointId === jitsiId
  );

  if (index > -1) {
    if (trackType === 'audio') {
      list[index].audioTrack = track;
    } else {
      list[index].videoTrack = track;
    }
  }

  return {
    list
  };
};

// const toggleMuteVideo = (): ThunkAction<void, RootState, unknown> => {
//   return dispatch => {
//     dispatch({
//       type: TOGGLE_MUTE_VIDEO
//     });
//   };
// };

// const _toggleMuteVideo = (state: InitialState) => {
//   const { list } = state;

//   if (list[0].videoTrack.isMuted()) {
//     list[0].videoTrack.unmute();
//   } else {
//     list[0].videoTrack.mute();
//   }

//   return {
//     list
//   };
// };

const resetUserlist = (): ThunkAction<void, RootState, unknown> => {
  return dispatch => {
    dispatch({
      type: RESET_USERLIST
    });
  };
};
const _resetUserlist = (state: InitialState) => {
  return {
    ...state,
    list: []
  };
};

export const actionCreators = {
  // joinUser,
  setUserInfo,
  resetUserlist,
  setUserTrack
  // toggleMuteVideo
};

export default reducer;
