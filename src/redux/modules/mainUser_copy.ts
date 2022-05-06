//#region Action Types

import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../configureStore';
import { Participant } from './participants_copy';

const SET_MAINUSER = 'mainUser_copy.SET_MAINUSER';
const UPDATE_MAINUSER_IS_MASTER = 'mainUser_copy.UPDATE_MAINUSER_IS_MASTER';
const SET_MAIN_VIEW = 'mainUser_copy.SET_MAIN_VIEW';
const TOGGLE_MUTEVIDEO = 'mainUser_copy.TOGGLE_MUTEVIDEO';
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
  isMuteVideo?: boolean;
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
    case UPDATE_MAINUSER_IS_MASTER:
      return _updateMainUserIsMaster(state, action);
    case SET_MAIN_VIEW:
      return _setMainView(state, action);
    case TOGGLE_MUTEVIDEO:
      return _toggleMuteVideo(state, action);
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
    isLocal: index === 0 ? true : false,
    isMuteVideo: index === 0 ? videoState.isMuted() : mainUserInfo?.videoTrack?.isMuted(),
  };

  return {
    ...state,
    jitsiId,
    wehagoId: mainUser.wehagoId,
    videoTrack: mainUser.videoTrack,
    name: mainUser.name,
    nickname: mainUser.nickname,
    avatar: mainUser.avatar,
    isLocal: mainUser.isLocal,
    isMuteVideo: mainUser.isMuteVideo
  };
};

const updateMainUserIsMaster = (): ThunkAction<void, RootState, unknown> => {
  return (dispatch, getState) => {
    const { masterList } = getState()['master'];
    dispatch({
      type: UPDATE_MAINUSER_IS_MASTER,
      masterList
    });
  };
};

const _updateMainUserIsMaster = (state: InitialState, action: AnyAction) => {
  const { wehagoId } = state;
  const { masterList } = action;
  let masters = masterList.slice(0);
  // console.log('wehagoId : ', wehagoId);
  let isMaster = masters.find((master: string) => master === wehagoId);
  // console.log('isMaster : ', isMaster);
  
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

const toggleMuteVideo = (
  isMute?: boolean
): ThunkAction<void, RootState, unknown> => {
  return dispatch =>
    dispatch({
      type: TOGGLE_MUTEVIDEO,
      isMute
    });
};

const _toggleMuteVideo = (state: InitialState, action: AnyAction) => {
  const { isMuteVideo } = state;
  const { isMute } = action;
  if (isMute !== undefined) {
    return {
      ...state,
      isMuteVideo: isMute
    };
  } else {
    return {
      ...state,
      isMuteVideo: !isMuteVideo
    };
  }
};

export const actionCreators = {
  setMainUser,
  updateMainUserIsMaster,
  setMainView,
  toggleMuteVideo
};

export default reducer;
