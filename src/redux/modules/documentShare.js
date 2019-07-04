//#region Action Types

// 문서공유 모드
const SET_DOCUMENT_LIST_MODE = 'SET_DOCUMENT_LIST_MODE';
const SET_SHARING_MODE = 'SET_SHARING_MODE';

//#endregion Action Types

//#region Initial State

const initialState = {
  documentListMode: false,
  attributes: false,
  presenter: false
};

//#endregion

//#region reducer

function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_DOCUMENT_LIST_MODE:
      return applySetDocumentListMode(state, action);
    case SET_SHARING_MODE:
      return applySetSharingMode(state, action);
    default:
      return state;
  }
}

//#endregion

//#region SET_DOCUMENT_LIST_MODE

function setDocumentListMode(documentListMode) {
  return dispatch => {
    dispatch({
      type: SET_DOCUMENT_LIST_MODE,
      documentListMode
    });
  };
}

function applySetDocumentListMode(state, action) {
  const { documentListMode } = action;
  return {
    ...state,
    documentListMode: documentListMode
  };
}

//#endregion

//#region SET_SHARING_MODE

function setSharingMode(attributes, presenter) {
  return dispatch => {
    dispatch({
      type: SET_SHARING_MODE,
      attributes,
      presenter
    });
  };
}

function applySetSharingMode(state, action) {
  const { attributes, presenter } = action;
  return {
    ...state,
    documentListMode: false,
    attributes: attributes,
    presenter: presenter
  };
}

//#endregion

export const actionCreators = {
  setDocumentListMode,
  setSharingMode
};

export default reducer;
