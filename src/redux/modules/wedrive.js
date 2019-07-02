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

const setFileList = fileList => {
  return {
    type: SET_FILE_LIST,
    fileList
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
  const { fileList } = action;
  return {
    ...state,
    ...fileList
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
  indexUseMode: null,
  tokenId: null,
  userId: null,
  directoryPath: null,
  fileUniqueKey: null,
  viewType: null,
  sortName: null,
  sortType: null,
  parentFileUniqueKey: null,
  currentPage: 0,
  // storageList
  accessTypeOpen: null,
  basePath: null,
  cnoOpen: null,
  isSearchView: null,
  pathDepth: null,
  storageList: [],
  storageListCnt: 0,
  totalPageCnt: 0,
  // fileInfoList
  fileInfo: null
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
    const { AUTH_A_TOKEN, AUTH_R_TOKEN, cno, ccode, HASH_KEY } = authData;
    const tokenResult = await WedriveApi.getToken(
      AUTH_A_TOKEN,
      AUTH_R_TOKEN,
      cno,
      ccode,
      HASH_KEY
    );

    if (tokenResult.resultCode === 200) {
      const userData = {
        indexUseMode: tokenResult.resultData.indexUseMode,
        tokenId: tokenResult.resultData.weDriveTokenId,
        userId: tokenResult.resultData.userId,
        directoryPath: tokenResult.resultData.directoryPath,
        fileUniqueKey: tokenResult.resultData.fileUniqueKey,
        viewType: tokenResult.resultData.viewType,
        sortName: tokenResult.resultData.sortName,
        sortType: tokenResult.resultData.sortType,
        parentFileUniqueKey: null,
        currentPage: 1
      };

      return dispatch(setInitInfo(userData));
    } else {
      return tokenResult;
    }
  };
};

/**
 * getFileListRequest
 */
const getFileListRequest = (authData, initInfo) => {
  return async dispatch => {
    const fileListResult = await WedriveApi.getList(authData, initInfo);

    if (fileListResult.resultCode === 200) {
      const fileListData = {
        accessTypeOpen: fileListResult.resultData.accessTypeOpen,
        basePath: fileListResult.resultData.basePath,
        cnoOpen: fileListResult.resultData.cnoOpen,
        isSearchView: fileListResult.resultData.isSearchView,
        pathDepth: fileListResult.resultData.pathDepth,
        storageList: fileListResult.resultData.storageList,
        storageListCnt: fileListResult.resultData.storageListCnt,
        totalPageCnt: fileListResult.resultData.totalPageCnt
      };

      return dispatch(setFileList(fileListData));
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
    console.log('1', fileListResult);

    if (fileListResult.resultCode === '0000') {
      const fileInfo = fileListResult.resultData;

      return dispatch(setFileInfo(fileInfo));
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
