//#region Action Types

import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../configureStore';
import { Participant } from './participants_copy';

const SET_MAINUSER = 'mainUser_copy.SET_MAINUSER';
const UPDATE_MAAINUSER_IS_MASTER = 'mainUser_copy.UPDATE_MAINUSER_IS_MASTER';
const SET_MAIN_VIEW = 'mainUser_copy.SET_MAIN_VIEW';
export interface InitialState
  extends TrackType,
    SketchType,
    DocumentType,
    ScreenType,
    CharacterType {
  jitsiId: string;
  wehagoId: string;
  name: string;
  nickname?: string;
  isMaster: boolean;
  mode: 'track' | 'sketch' | 'document' | 'screen' | 'character';
  isLocal: boolean;
}

interface TrackType {
  videoTrack?: any;
}
interface SketchType {
  attribute?: any;
}
interface DocumentType {}
interface ScreenType {}
interface CharacterType {
  avatar?: string;
}

//#region Initial State

const initialState: InitialState = {
  jitsiId: '',
  wehagoId: '',
  isMaster: false,
  mode: 'character',
  name: '',
  isLocal: false
};

//#endregion

//#region reducer

function reducer(state = initialState, action: AnyAction) {
  switch (action.type) {
    case SET_MAINUSER:
      return _setMainUser(state, action);
    case UPDATE_MAAINUSER_IS_MASTER:
      return _updateMainUserIsMaster(state, action);
    case SET_MAIN_VIEW:
      return _setMainView(state, action);
    default:
      return state;
  }
}

const setMainUser = (
  jitsiId: string
): ThunkAction<void, RootState, unknown> => {
  return (dispatch, getState) => {
    const { list } = getState()['participants_copy'];
    const { videoState } = getState()['conference'];
    dispatch({
      type: SET_MAINUSER,
      jitsiId,
      list,
      videoState
    });
  };
};

const _setMainUser = (state: InitialState, action: AnyAction) => {
  const { jitsiId, list, videoState } = action;
  console.log('videoState : ', videoState);
  const userList = list.slice(0);
  if (jitsiId === undefined) {
    return {
      ...initialState
    };
  }

  const index = userList.findIndex(
    (info: Participant) => info.jitsiId === jitsiId
  );
  const mainUserInfo = userList[index];
  const mainUser = {
    videoTrack: index === 0 ? videoState : mainUserInfo?.videoTrack,
    name: mainUserInfo?.name,
    wehagoId: mainUserInfo?.wehagoId,
    nickname: mainUserInfo?.nickname,
    avatar: mainUserInfo?.avatar,
    isLocal: index === 0 ? true : false
  };
  console.log('mainUser : ', mainUser);

  return {
    ...state,
    jitsiId,
    wehagoId: mainUser.wehagoId,
    videoTrack: mainUser.videoTrack,
    name: mainUser.name,
    nickname: mainUser.nickname,
    avatar: mainUser.avatar,
    isLocal: mainUser.isLocal
  };
};

const updateMainUserIsMaster = (): ThunkAction<void, RootState, unknown> => {
  return (dispatch, getState) => {
    const { masterList } = getState()['master'];
    dispatch({
      type: UPDATE_MAAINUSER_IS_MASTER,
      masterList
    });
  };
};

const _updateMainUserIsMaster = (state: InitialState, action: AnyAction) => {
  const { wehagoId } = state;
  const { masterList } = action;
  let masters = masterList.slice(0);
  let isMaster = masters.find((master: string) => master === wehagoId);
  if (isMaster) {
    isMaster = true;
  } else {
    isMaster = false;
  }
  return {
    ...state,
    isMaster
  };
};

const setMainView = (
  mode: 'track' | 'sketch' | 'document' | 'screen' | 'character'
): ThunkAction<void, RootState, unknown> => {
  return dispatch => {
    dispatch({
      type: SET_MAIN_VIEW,
      mode
    });
  };
};

const _setMainView = (state: InitialState, action: AnyAction) => {
  const { mode } = action;

  if (mode === 'track' || mode === 'character') {
    return {
      ...state,
      mode
    };
  } else if (mode === 'sketch') {
    return {
      ...state,
      mode
    };
  } else if (mode === 'document') {
    return {
      ...state,
      mode
    };
  } else if (mode === 'screen') {
    return {
      ...state,
      mode
    };
  }
};

export const actionCreators = {
  setMainUser,
  updateMainUserIsMaster,
  setMainView
};

export default reducer;
