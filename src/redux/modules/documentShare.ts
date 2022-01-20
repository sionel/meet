//#region Action Types

import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../configureStore';

// 문서공유 모드
const SET_DOCUMENT_LIST_MODE = 'documentShare.SET_DOCUMENT_LIST_MODE';
const SET_SHARING_MODE = 'documentShare.SET_SHARING_MODE';
const SET_DOCUMENT_PAGE = 'documentShare.SET_DOCUMENT_PAGE';
const SET_DRAW_DATA = 'documentShare.SET_DRAW_DATA';

// boolean 다 제거 해야할거 같음.
//#endregion Action Types
export interface state {
  documentListMode: string[] | boolean;
  attributes: object | boolean;
  presenter: string | boolean;
  page: number;
  documentData: any[];
  mode: string | null;
}

//#region Initial State

const initialState = {
  documentListMode: false,
  attributes: false,
  presenter: false,
  page: 0,
  documentData: [],
  mode: null
};

//#endregion

//#region reducer

function reducer(state = initialState, action: AnyAction) {
  switch (action.type) {
    case SET_DOCUMENT_LIST_MODE:
      return applySetDocumentListMode(state, action);
    case SET_SHARING_MODE:
      return applySetSharingMode(state, action);
    case SET_DOCUMENT_PAGE:
      return applysetDocumentPage(state, action);
    case SET_DRAW_DATA:
      return applysetDrawData(state, action);
    default:
      return state;
  }
}

//#endregion

//#region SET_DOCUMENT_LIST_MODE

function setDocumentListMode(
  documentListMode: string[]
): ThunkAction<void, RootState, unknown> {
  return dispatch => {
    dispatch({
      type: SET_DOCUMENT_LIST_MODE,
      documentListMode
    });
    dispatch({
      type: 'mainUser.SET_DOCUMENT_LIST_MODE',
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
      presenter,
      page,
      documentData,
      mode
    });
    dispatch({
      type: 'mainUser.SET_SHARING_MODE',
      attributes,
      presenter
    });
  };
}

function applySetSharingMode(state: state, action: AnyAction) {
  const { attributes, presenter, page, documentData, mode } = action;
  return {
    ...state,
    documentListMode: false,
    attributes: attributes,
    presenter: presenter,
    page: page,
    documentData: documentData,
    mode: mode
  };
}

//#endregion

//#region SET_DOCUMENT_PAGE

function setDocumentPage(page: number): ThunkAction<void, RootState, unknown> {
  return dispatch => {
    dispatch({
      type: SET_DOCUMENT_PAGE,
      page
    });
  };
}

function applysetDocumentPage(state: state, action: AnyAction) {
  const { page } = action;
  return {
    ...state,
    page: page
  };
}

//#endregion

//#region SET_DRAW_DATA

function setDrawData(
  documentData: object,
  selectResource: number
): ThunkAction<void, RootState, unknown> {
  return dispatch => {
    dispatch({
      type: SET_DRAW_DATA,
      documentData,
      selectResource
    });
  };
}

function applysetDrawData(state: state, action: AnyAction) {
  const { documentData, page } = state;
  const { documentData: newData, selectResource } = action;

  let newDocumentData = documentData.slice(0);
  newDocumentData[selectResource] = newData;

  return {
    ...state,
    documentData: newDocumentData
  };
}

//#endregion

export const actionCreators = {
  setDocumentListMode,
  setSharingMode,
  setDocumentPage,
  setDrawData
};

export default reducer;
