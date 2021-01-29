/**
 * wedrive.js
 */
import { WedriveApi } from '../../services';
import FetchCancel from 'react-native-cancelable-fetch';

const SET_LOADING_STATUS = 'wedrive.SET_LOADING_STATUS';

const SET_INIT_INFO = 'wedrive.SET_INIT_INFO';
const SET_FILE_LIST = 'wedrive.SET_FILE_LIST';
const SET_FILE_INFO = 'wedrive.SET_FILE_INFO';
const UPDATE_FILE_LIST_UPDATE = 'wedrive.UPDATE_FILE_LIST_UPDATE';

//#region Action Creators

const setStatusLoading = status => {
  return {
    type: SET_LOADING_STATUS,
    status
  };
};

const setInitInfo = initInfo => {
  const data = initInfo || {
    status: 'INIT',
    TokenID: null,
    storageList: [],
    fileInfo: [],
    temp: []
  };
  return {
    type: SET_INIT_INFO,
    initInfo: data
  };
};

const setFileList = storageList => {
  return {
    type: SET_FILE_LIST,
    storageList
  };
};

const updateFileList = (storageList, directory) => {
  return {
    type: UPDATE_FILE_LIST_UPDATE,
    storageList,
    directory
  };
};

const setFileInfo = fileInfo => {
  return {
    type: SET_FILE_INFO,
    fileInfo
  };
};

/**
 * applys
 */
const applySetStatusLoading = (state, action) => {
  const { status } = action;
  return {
    ...state,
    status
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

const applyUpdateFileList = (state, action) => {
  const { storageList: list, directory } = action;

  let newList = list.slice(0);
  directory.fileUniqueKey !== directory.path &&
    newList.unshift({
      directory: true,
      fileName: '이전폴더',
      type: 'preFolder',
      fileUniqueKey: directory.parentFileUniqueKey,
      parentFileUniqueKey: directory.path,
      path: directory.parentFileUniqueKey,
      preFolder: true
    });

  return {
    ...state,
    storageList: newList
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
  status: 'INIT',
  TokenID: null,
  storageList: [],
  fileInfo: [],
  temp: []
};

//#endregion initialState

//#region Reducer

reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOADING_STATUS:
      return applySetStatusLoading(state, action);
    case SET_INIT_INFO:
      return applyInitInfo(state, action);
    case SET_FILE_LIST:
      return applyFileList(state, action);
    case UPDATE_FILE_LIST_UPDATE:
      return applyUpdateFileList(state, action);
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
const initInfoRequest = (authData, last_access_company_no) => {
  return async dispatch => {
    await dispatch(setStatusLoading('LOADING'));

    const { AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY, portalID } = authData;
    const tokenResult = await WedriveApi.getToken(
      AUTH_A_TOKEN,
      AUTH_R_TOKEN,
      HASH_KEY,
      portalID
    );

    await dispatch(setStatusLoading('FINISH'));

    if (tokenResult.resultList) {
      const wedriveToken = {
        TokenID: `${tokenResult.resultList[0][last_access_company_no].objectTokenId}@@${AUTH_A_TOKEN}`
      };

      return dispatch(setInitInfo(wedriveToken));
    } else {
      await dispatch(setStatusLoading('FINISH'));
      return tokenResult;
    }
  };
};

/**
 * getFileListRequest
 */
const getFileListRequest = (authData, TokenID) => {
  return async dispatch => {
    await dispatch(setStatusLoading('LOADING'));
    const fileListResult = await WedriveApi.getList(authData, TokenID);

    dispatch(setStatusLoading('FINISH'));

    if (fileListResult.resultList) {
      // 이름 순으로 정렬
      const sortedList = await fileListResult.resultList.sort((a, b) => {
        if (a.directory) return -1;
        if (b.directory) return 1;
        return a.fileName > b.fileName ? 1 : -1;
      });

      return dispatch(setFileList(sortedList));
    } else {
      await dispatch(setStatusLoading('FINISH'));
      return fileListResult;
    }
  };
};

/**
 * getFileInfoRequest
 */
const getFileInfoRequest = (authData, fileData) => {
  return async dispatch => {
    await dispatch(setStatusLoading('FILE_LOADING'));
    const fileListResult = await WedriveApi.getFileInfo(authData, fileData);

    dispatch(setStatusLoading('FINISH'));

    if (fileListResult.resultList) {
      return dispatch(setFileInfo(fileListResult.resultList));
    } else {
      return fileListResult;
    }
  };
};

/**
 * getDirectoryInfoRequest
 */
const getDirectoryInfoRequest = (authData, directory) => {
  return async dispatch => {
    await dispatch(setStatusLoading('LOADING'));

    const fileListResult = await WedriveApi.getDirectoryInfo(
      authData,
      directory
    );

    await dispatch(setStatusLoading('FINISH'));

    if (fileListResult.resultList) {
      const sortedList = await fileListResult.resultList.sort((a, b) => {
        if (a.directory) return -1;
        if (b.directory) return 1;
        return a.fileName > b.fileName ? 1 : -1;
      });
      return dispatch(updateFileList(sortedList, directory));
    } else {
      return fileListResult;
    }
  };
};

const cancelLoadDocument = requestName => {
  return async dispatch => {
    FetchCancel.abort(requestName);
    await dispatch(setStatusLoading('CANCELED'));
    return true;
  };
};

//#endregion

//#region Export

export const actionCreators = {
  setInitInfo,
  initInfoRequest,
  getFileListRequest,
  getFileInfoRequest,
  getDirectoryInfoRequest,
  cancelLoadDocument
};

export default reducer;

//#endregion Export
