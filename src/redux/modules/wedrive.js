/**
 * wedrive.js
 */
import { WedriveApi } from '../../services';

const SET_INIT_INFO = 'SET_INIT_INFO';
const SET_FILE_LIST = 'SET_FILE_LIST';

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
  totalPageCnt: 0
};

//#endregion initialState

//#region Reducer

reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_INIT_INFO:
      return applyInitInfo(state, action);
    case SET_FILE_LIST:
      return applyFileList(state, action);
    default:
      return state;
  }
};

//#endregion Reducer

//#region Action Creators

const setInitInfo = initInfo => {
  return {
    type: SET_INIT_INFO,
    initInfo
  };
};

const applyInitInfo = (state, action) => {
  const { initInfo } = action;
  return {
    ...state,
    ...initInfo
  };
};

const setFileList = fileList => {
  return {
    type: SET_FILE_LIST,
    fileList
  };
};

const applyFileList = (state, action) => {
  const { fileList } = action;
  return {
    ...state,
    ...fileList
  };
};

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
//#endregion

const getFileListRequest = (authData, initInfo) => {
  return async dispatch => {
    const fileListResult = await WedriveApi.getList(authData, initInfo);

    if (fileListResult.resultCode === 200) {
      const fileListData = fileListResult.resultData;

      return dispatch(setFileList(fileListData));
    } else {
      return fileListData;
    }
  };
};

//#region Export

export const actionCreators = {
  initInfoRequest,
  getFileListRequest
};

export default reducer;

//#endregion Export
