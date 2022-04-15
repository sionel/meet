import { actionCreators as mainUserActionCreators } from './mainUser';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../configureStore';

const JOIN_USER = 'participants_copy.JOIN_USER';
const SET_USER_INFO = 'participants_copy.SET_USER_INFO';
const SET_USER_TRACK = 'participants_copy.SET_USER_TRACK';

export interface Participant {
  // isMainUser:boolean

  jitsiId: string;
  videoTrack: any;
  audioTrack: any;

  isMaster: boolean;

  name: string;
  nickname: string;
  wehagoId: string;
  avatar: string;
  fullPath: string;
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
    case JOIN_USER:
      return _joinUser(state, action);
    case SET_USER_INFO:
      return _setUserInfo(state, action);
    case SET_USER_TRACK:
      return _setUserTrack(state, action);
    default:
      return state;
  }
}

const joinUser = (user: any): ThunkAction<void, RootState, unknown> => {
  return dispatch => {
    dispatch({
      type: JOIN_USER,
      user
    });
  };
};
const _joinUser = (state: InitialState, action: AnyAction) => {
  const { user } = action;
  console.log('_joinUser');
  console.log(user);

  return {
    ...state
  };
};

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
  console.log('_setUserInfo');
  console.log(user);
  return {
    ...state
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
  console.log('_setUserTrack');
  console.log(track);
  return {
    ...state
  };
};

export const actionCreators = {
  joinUser,
  setUserInfo,
  setUserTrack
};

export default reducer;
