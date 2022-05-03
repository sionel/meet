/**
 * wedrive.js
 */
import { WedriveApi } from '@services/index';
//TODO: abort 하려고 사용중인거 같은데 type 버전도 없고
// 라이브러리개발이 5년전임
import FetchCancel from 'react-native-cancelable-fetch';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../configureStore';

const SET_LOADING_STATUS = 'wedrive.SET_LOADING_STATUS';

const SET_INIT_INFO = 'wedrive.SET_INIT_INFO';
const SET_FILE_LIST = 'wedrive.SET_FILE_LIST';
const SET_FILE_INFO = 'wedrive.SET_FILE_INFO';
const UPDATE_FILE_LIST_UPDATE = 'wedrive.UPDATE_FILE_LIST_UPDATE';

//#region Action Creators

interface fileInfo {
  bizId: string;
  bizShareFolder: boolean;
  createDate: string;
  directory: boolean;
  favorite: boolean;
  fileCount: number;
  fileName: string;
  fileUniqueKey: string;
  fileVersion: number;
  folderCount: number;
  lastModifyDate: string;
  lastModifyUser: string;
  level: number;
  lock: boolean;
  memo: boolean;
  mimeType: string;
  parentFileUniqueKey: string;
  path: string;
  shareFolder: boolean;
  size: number;
  subDirectory: boolean;
  thumbNailPath: string;
  updateUserViewPath: boolean;
  uploadDate: string;
  uploadUser: string;
}

export interface state {
  status: string;
  TokenID: string;
  storageList: any[];
  fileInfo: any[];
  temp: any[];
}

const setStatusLoading = (status: string) => {
  return {
    type: SET_LOADING_STATUS,
    status
  };
};

const setInitInfo = (initInfo?: Partial<state>) => {
  const data = initInfo || {
    status: 'INIT',
    TokenID: '',
    storageList: [],
    fileInfo: [],
    temp: []
  };
  return {
    type: SET_INIT_INFO,
    initInfo: data
  };
};

const applyInitInfo = (state: state, action: AnyAction) => {
  const { initInfo } = action;
  
  return {
    ...state,
    ...initInfo
  };
};

const setFileList = (storageList: fileInfo[]) => {
  return {
    type: SET_FILE_LIST,
    storageList
  };
};

const updateFileList = (storageList: any[], directory: any) => {
  return {
    type: UPDATE_FILE_LIST_UPDATE,
    storageList,
    directory
  };
};

const setFileInfo = (fileInfo: any[]) => {
  return {
    type: SET_FILE_INFO,
    fileInfo
  };
};

/**
 * applys
 */
const applySetStatusLoading = (state: state, action: AnyAction) => {
  const { status } = action;
  return {
    ...state,
    status
  };
};



const applyFileList = (state: state, action: AnyAction) => {
  const { storageList } = action;
  return {
    ...state,
    storageList
  };
};

const applyUpdateFileList = (state: state, action: AnyAction) => {
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

const applyFileInfo = (state: state, action: AnyAction) => {
  const { fileInfo } = action;
  return {
    ...state,
    fileInfo
  };
};

//#region initialState

const initialState = {
  status: 'INIT',
  TokenID: '',
  storageList: [],
  fileInfo: [],
  temp: []
};

//#endregion initialState

//#region Reducer

const reducer = (state = initialState, action: AnyAction) => {
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


/**
 * getFileListRequest
//  */


/**
 * getFileInfoRequest
 */
const getFileInfoRequest = (
  authData: any,
  fileData: any
): ThunkAction<void, RootState, unknown> => {
  return async dispatch => {
    await dispatch(setStatusLoading('FILE_LOADING'));
    const fileListResult = await WedriveApi.getFileInfo(authData, fileData);

    dispatch(setStatusLoading('FINISH'));
    console.log('fileListResult : ', fileListResult);
    
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
const getDirectoryInfoRequest = (
  authData: any,
  directory: any
): ThunkAction<void, RootState, unknown> => {
  return async dispatch => {
    await dispatch(setStatusLoading('LOADING'));

    const fileListResult = await WedriveApi.getDirectoryInfo(
      authData,
      directory
    );

    await dispatch(setStatusLoading('FINISH'));

    if (fileListResult.resultList) {
      const sortedList = await fileListResult.resultList.sort(
        (a: any, b: any) => {
          if (a.directory) return -1;
          if (b.directory) return 1;
          return a.fileName > b.fileName ? 1 : -1;
        }
      );
      return dispatch(updateFileList(sortedList, directory));
    } else {
      return fileListResult;
    }
  };
};

const cancelLoadDocument = (
  requestName: any
): ThunkAction<void, RootState, unknown> => {
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
  setStatusLoading,
  setFileList,
  getFileInfoRequest,
  getDirectoryInfoRequest,
  cancelLoadDocument
};

export default reducer;

//#endregion Export
