//#region Action Types

import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../configureStore';

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
}

interface TrackType {
  videoTrack?: any;
}
interface SketchType {}
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
  name: ''
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

const setMainUser = (user: any): ThunkAction<void, RootState, unknown> => {
  return dispatch => {
    dispatch({
      type: SET_MAINUSER,
      user
    });
  };
};

const _setMainUser = (state: InitialState, action: AnyAction) => {
  const { user } = action;

  if (user === undefined) {
    return {
      ...initialState
    };
  }

  const mainUser = {
    jitsiId: user.value,
    videoTrack: user.attributes?.videoTrack,
    name: user.attributes.userName,
    wehagoId: user.attributes?.wehagoId,
    nickname: user.attributes?.nickname
  };

  const avatar = user.attributes.avatar
    ? JSON.parse(user.attributes.avatar).value
    : 'jangok';

  return {
    ...state,
    jitsiId: mainUser.jitsiId,
    wehagoId: mainUser.wehagoId,
    videoTrack: mainUser.videoTrack,
    name: mainUser.name,
    nickname: mainUser.nickname,
    avatar
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
