//#region Action Types

import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../configureStore';

// init 설정
const INIT = 'mainUser.INIT';

// MAIN_USER 설정
const SET_MAIN_USER = 'mainUser.SET_MAIN_USER';

// 메인유저가 없을때만 MAIN_USER 설정
const SET_MAIN_USER_NOTEXIST = 'mainUser.SET_MAIN_USER_NOTEXIST';

//#endregion Action Types

export interface Initialstate {
  jitsiId: string;
  mode: 'track' | 'sketch' | 'document' | 'screen';
}

//#region Initial State

const initialState: Initialstate = {
  jitsiId: '',
  mode: 'track'
};

//#endregion

//#region reducer

function reducer(state = initialState, action: AnyAction) {
  switch (action.type) {
    case INIT:
      return _initMainUser();
    case SET_MAIN_USER:
      return applySetMainUser(state, action);
    case SET_MAIN_USER_NOTEXIST:
      return applySetMainUserNotExist(state);
    default:
      return state;
  }
}

//#endregion

function initMainUser() {
  return { type: INIT };
}
function _initMainUser() {
  return { ...initialState };
}
//#region SET_MAIN_USER

function setMainUser(
  mainUserId: string
): ThunkAction<void, RootState, unknown> {
  return dispatch => {
    dispatch({
      type: SET_MAIN_USER,
      mainUserId
    });
  };
}

function applySetMainUser(state: state, action: AnyAction) {
  const { mainUserId } = action;
  return {
    ...state,
    mainUserId
  };
}

//#endregion

//#region SET_MAIN_USER_NOTEXIST

function setMainUserNotExist(): ThunkAction<void, RootState, unknown> {
  return (dispatch, getState) => {
    if (!getState().mainUser.mainUserId) {
      dispatch({
        type: SET_MAIN_USER_NOTEXIST
      });
    }
  };
}

function applySetMainUserNotExist(state: state) {
  return {
    ...state,
    mainUserId: 'localUser'
  };
}

//#endregion

//#region SET_DRAWING_MODE
//TODO: 어디서 사용하고 있는지 파악이 안됨.
// function setDrawingMode(drawingMode: any): ThunkAction<void, RootState, unknown> {
//   console.log('drawingMode : ', drawingMode);

//   return dispatch => {
//     dispatch({
//       type: SET_DRAWING_MODE,
//       drawingMode
//     });
//   };
// }

// function applySetDrawingMode(state: state, action: AnyAction) {
//   const { drawingMode } = action;
//   return {
//     ...state,
//     // drawingMode: !state.drawingMode
//     drawingMode: drawingMode
//   };
// }

//#endregion

export const actionCreators = {
  setMainUser,
  setMainUserNotExist,
  initMainUser
};

export default reducer;
