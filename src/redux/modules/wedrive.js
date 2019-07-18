/**
 * wedrive.js
 */
import { WedriveApi } from '../../services';

const SET_INIT_INFO = 'SET_INIT_INFO';
const SET_FILE_LIST = 'SET_FILE_LIST';
const SET_FILE_INFO = 'SET_FILE_INFO';

//#region Action Creators

const setInitInfo = initInfo => {
  return {
    type: SET_INIT_INFO,
    initInfo
  };
};

const setFileList = storageList => {
  return {
    type: SET_FILE_LIST,
    storageList
  };
};

const setFileInfo = fileInfo => {
  return {
    type: SET_FILE_INFO,
    fileInfo
  };
};

const applyInitInfo = (state, action) => {
  const { initInfo } = action;
  return {
    ...state,
    ...initInfo
  };
};

const applyFileList = (state, action) => {
  const { storageList } = action;
  return {
    ...state,
    storageList
  };
};

const applyFileInfo = (state, action) => {
  const { fileInfo } = action;
  return {
    ...state,
    fileInfo
  };
};

//#region initialState

const initialState = {
  // initInfo
  TokenID: null,
  // indexUseMode: null,
  // tokenId: null,
  // userId: null,
  // directoryPath: null,
  // fileUniqueKey: null,
  // viewType: null,
  // sortName: null,
  // sortType: null,
  // parentFileUniqueKey: null,
  // currentPage: 0,

  // storageList
  // directory: [],
  // accessTypeOpen: null,
  // basePath: null,
  // cnoOpen: null,
  // isSearchView: null,
  // pathDepth: null,
  storageList: [],
  // storageListCnt: 0,
  // totalPageCnt: 0,
  // fileInfoList
  fileInfo: []
};

//#endregion initialState

//#region Reducer

reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_INIT_INFO:
      return applyInitInfo(state, action);
    case SET_FILE_LIST:
      return applyFileList(state, action);
    case SET_FILE_INFO:
      return applyFileInfo(state, action);
    default:
      return state;
  }
};

//#endregion Reducer

/**
 * initInfoRequest
 */
const initInfoRequest = authData => {
  return async dispatch => {
    const { AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY, portalID } = authData;
    const tokenResult = await WedriveApi.getToken(
      AUTH_A_TOKEN,
      AUTH_R_TOKEN,
      HASH_KEY,
      portalID
    );

    if (tokenResult.resultList) {
      const wedriveToken = {
        TokenID: `${tokenResult.resultList[0][9].objectTokenId}@@${AUTH_A_TOKEN}`
      };

      return dispatch(setInitInfo(wedriveToken));
    } else {
      return tokenResult;
    }
  };
};

/**
 * getFileListRequest
 */
const getFileListRequest = (authData, TokenID) => {
  return async dispatch => {
    const fileListResult = await WedriveApi.getList(authData, TokenID);

    if (fileListResult.resultList) {
      // 이름 순으로 정렬
      const sortedList = await fileListResult.resultList.sort((a, b) => {
        if (a.directory) return -1;
        if (b.directory) return 1;
        return a.fileName > b.fileName ? 1 : -1;
      });

      return dispatch(setFileList(sortedList));
    } else {
      return fileListResult;
    }
  };
};

/**
 * getFileInfoRequest
 */
const getFileInfoRequest = (authData, fileData) => {
  return async dispatch => {
    const fileListResult = await WedriveApi.getFileInfo(authData, fileData);

    if (fileListResult.resultList) {
      return dispatch(setFileInfo(fileListResult.resultList));
    } else {
      return fileListResult;
    }
  };
};

//#endregion

//#region Export

export const actionCreators = {
  initInfoRequest,
  getFileListRequest,
  getFileInfoRequest
};

export default reducer;

//#endregion Export
