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

// 드로잉모드
const SET_DRAWING_MODE = 'mainUser.SET_DRAWING_MODE';

// 문서공유 모드
const SET_DOCUMENT_LIST_MODE = 'mainUser.SET_DOCUMENT_LIST_MODE';
const SET_SHARING_MODE = 'mainUser.SET_SHARING_MODE';

//#endregion Action Types

export interface state {
  mainUserId: string | null;
  drawingMode: any;
  documentListMode: string[] | boolean;
  sharingMode: object | boolean;
  presenter: string | boolean;
}

//#region Initial State

const initialState = {
  mainUserId: null,
  drawingMode: false,
  documentListMode: false,
  sharingMode: false,
  presenter: false
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
    // case SET_DRAWING_MODE:
    //   return applySetDrawingMode(state, action);
    case SET_DOCUMENT_LIST_MODE:
      return applySetDocumentListMode(state, action);
    case SET_SHARING_MODE:
      return applySetSharingMode(state, action);
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

//#region SET_DOCUMENT_LIST_MODE

function setDocumentListMode(
  documentListMode: string[] | boolean
): ThunkAction<void, RootState, unknown> {
  return dispatch => {
    dispatch({
      type: SET_DOCUMENT_LIST_MODE,
      documentListMode
    });
    dispatch({
      type: 'documentShare.SET_DOCUMENT_LIST_MODE',
      documentListMode
    });
  };
}

function applySetDocumentListMode(state: state, action: AnyAction) {
  const { documentListMode } = action;
  return {
    ...state,
    documentListMode: documentListMode
  };
}

//#endregion

//#region SET_SHARING_MODE

function setSharingMode(
  attributes = false,
  presenter = false,
  page = 0,
  documentData = [],
  mode = null
): ThunkAction<void, RootState, unknown> {
  return dispatch => {
    dispatch({
      type: SET_SHARING_MODE,
      attributes,
      presenter
    });
    dispatch({
      type: 'documentShare.SET_SHARING_MODE',
      attributes,
      presenter,
      page,
      documentData,
      mode
    });
  };
}

function applySetSharingMode(state: state, action: AnyAction) {
  const { attributes, presenter } = action;
  return {
    ...state,
    documentListMode: false,
    sharingMode: attributes,
    presenter: presenter
  };
}

//#endregion

export const actionCreators = {
  setMainUser,
  setMainUserNotExist,
  // setDrawingMode,
  setDocumentListMode,
  setSharingMode,
  initMainUser
};

export default reducer;
