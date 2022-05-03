import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import FileListPresenter from './FileListPresenter';

import { actionCreators as WedriveActions } from '@redux/wedrive';
import { actionCreators as DocumentShareActions } from '@redux/documentShare';

import { FileListContainerProps } from '@screens/ConferenceScreen_New/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/configureStore';
import { getT } from '@utils/translateManager';
import { WedriveApi } from '@services/index';

const FileListContainer: React.FC<FileListContainerProps> = ({}) => {
  const t = getT();

  const { auth, TokenID, fileInfo, room, isLoading, wedriveList } = useSelector(
    (state: RootState) => ({
      auth: state.user.auth,
      TokenID: state.wedrive.TokenID,
      fileInfo: state.wedrive.fileInfo,
      room: state.conference.room,
      isLoading: state.wedrive.status,
      wedriveList: state.wedrive.storageList
    })
  );

  const {
    AUTH_A_TOKEN,
    AUTH_R_TOKEN,
    HASH_KEY,
    portal_id,
    last_access_company_no
  } = auth;

  let pk: any[] = [];

  //#region  dispatch
  const dispatch = useDispatch();

  // const getFileListRequest = (authData: any, initInfo: any) => {
  //   dispatch(WedriveActions.getFileListRequest(authData, initInfo));
  // };

  const setDocumentListMode = () => {
    dispatch(DocumentShareActions.setDocumentListMode());
  };

  const getDirectoryInfoRequest = (authData: any, directory: any) => {
    dispatch(WedriveActions.getDirectoryInfoRequest(authData, directory));
  };

  const getFileInfoRequest = (authData: any, fileInfo: any) => {
    dispatch(WedriveActions.getFileInfoRequest(authData, fileInfo));
  };

  const setStatusLoading = (status: string) => {
    dispatch(WedriveActions.setStatusLoading(status));
  };

  const setInitInfo = (info: any) => {
    dispatch(WedriveActions.setInitInfo(info));
  };

  const setFileList = (list: any[]) => {
    dispatch(WedriveActions.setFileList(list));
  };
  //#endregion

  const getFileList = async () => {
    await _handleGetWedriveToken();
  };

  const _handleGetWedriveToken = async () => {
    const authData = {
      AUTH_A_TOKEN: AUTH_A_TOKEN,
      AUTH_R_TOKEN: AUTH_R_TOKEN,
      HASH_KEY,
      portalID: `${portal_id}`,
      last_access_company_no
    };
    setStatusLoading('LOADING');
    const tokenResult = await WedriveApi.getToken(
      authData.AUTH_A_TOKEN,
      authData.AUTH_R_TOKEN,
      authData.HASH_KEY,
      authData.portalID
    );
    setStatusLoading('FINISH');

    const wedriveToken = {
      TokenID: `${tokenResult.resultList[0][last_access_company_no].objectTokenId}@@${AUTH_A_TOKEN}`
    };
    setInitInfo(wedriveToken);

    if (!TokenID) {
      Alert.alert(t('alert_title_error'), t('alert_text_fail_user_info'));
      setDocumentListMode();
      return;
    } else {
      await _handleGetFileList(authData);
    }
  };

  const _handleGetFileList = async (authData: any) => {
    // wedrive file list 가져오기

    setStatusLoading('LOADING');
    const fileListResult = await WedriveApi.getList(authData, TokenID);

    setStatusLoading('FINISH');

    // 이름 순으로 정렬
    const sortedList = await fileListResult.resultList.sort(
      (a: any, b: any) => {
        if (a.directory) return -1;
        if (b.directory) return 1;
        return a.fileName > b.fileName ? 1 : -1;
      }
    );

    setFileList(sortedList);

    if (wedriveList.length === 0) {
      Alert.alert(t('alert_title_error'), t('alert_text_fail_file_list'));
      return;
    }
  };

  const _handleGetDirectoryInfo = async (directory: any) => {
    const authData = {
      AUTH_A_TOKEN,
      AUTH_R_TOKEN,
      HASH_KEY
    };

    let preFolder = '';
    if (directory.preFolder) {
      preFolder = pk.pop();
    } else {
      pk.push(directory.parentFileUniqueKey);
    }

    const directoryInfo = {
      TokenID: TokenID,
      FileUniqueKey: preFolder || directory.fileUniqueKey,
      fileUniqueKey: preFolder || directory.fileUniqueKey,
      parentFileUniqueKey: directory.parentFileUniqueKey,
      path: portal_id + '@'
    };

    await getDirectoryInfoRequest(authData, directoryInfo);
  };

  const _handleConvertFileSize = (byte: any) => {
    if (byte > 1000) {
      const kByte = byte / 1024;
      if (kByte > 1000) {
        const mByte = kByte / 1024;
        if (mByte > 1000) {
          const gByte = mByte / 1024;
          return Math.round(gByte * 100) / 100 + ' GB';
        } else return Math.round(mByte * 100) / 100 + ' MB';
      } else return Math.round(kByte * 100) / 100 + ' KB';
    } else return byte + ' byte';
  };

  const _handleSharingMode = (file: any) => {
    _handleGetFileInfo(file);
  };

  const _handleGetFileInfo = async (file: any) => {
    if (file.size > 1024 * 1024 * 20) {
      Alert.alert(
        t('alert_title_size_over'),
        t('alert_text_fail_share_file_size')
      );
      return;
    }

    const authData = {
      AUTH_A_TOKEN,
      AUTH_R_TOKEN,
      HASH_KEY
    };

    const extentionType = file.directory
      ? 'directory'
      : file.fileName.split('.').pop().toLowerCase();
    let method = '';

    switch (extentionType) {
      case 'txt':
      case 'rtf':
      case 'ppt':
      case 'pptx':
      case 'show':
      case 'one':
      case 'hwp':
      case 'doc':
      case 'docx':
      case 'xls':
      case 'xlsx':
        method = 'getOfficePreView';
        break;
      case 'bmp':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'png':
      case 'tif':
      case 'tiff':
        method = 'getImageURL';
        break;
      case 'pdf':
        method = 'getOfficePreView';
        break;
      case 'directory':
        _handleGetDirectoryInfo(file);
        return;
      default:
        Alert.alert(
          t('alert_title_unsupported'),
          t('alert_text_unsupported_doc')
        );
        return;
    }

    const fileInfo = {
      Ext: extentionType,
      FileName: file.fileUniqueKey,
      FileUniqueKey: file.fileUniqueKey,
      cno: last_access_company_no,
      target_cno: last_access_company_no,
      ServiceCode: 'wedrive',
      ServiceKey: '',
      BucketType: 'C',
      BucketName: 'undefined',
      isWedrive: 'true',
      isFullPreview: 'false',
      TokenID: TokenID,
      method: method
    };

    await getFileInfoRequest(authData, fileInfo);

    if (wedriveList.length > 0) {
      _handleChangeSharingMode(file.fileName);
      return;
    }

    // if (fileInfoResponse.resultCode === 'E2021') {
    //   Alert.alert(t('alert_title_conversion'),t('alert_text_wait'));
    //   return;
    // }

    Alert.alert(t('alert_title_loading_fail'), t('alert_text_wait'));
    return;
  };

  const _handleChangeSharingMode = (fileName: any) => {
    let resources = [];
    if (typeof fileInfo[0] === 'string') {
      // 이미지 리소스가 1개 일 때는 배열로 안줌
      resources = fileInfo;
    } else if (!fileInfo[0].resources) {
      // 이미지 리소스가 없을 시
      Alert.alert(t('alert_title_loading_fail'), t('alert_text_wait'));
      return;
    } else {
      // 이미지 리소스가 여러개일 경우
      resources = fileInfo[0].resources;
    }
    room?.sendMessage.setToogleDocumentShare({
      fileName: fileName,
      owner: portal_id,
      resources: JSON.stringify(resources)
    });
  };

  useEffect(() => {
    getFileList();
  }, []);

  return (
    <FileListPresenter
      isLoading={isLoading}
      documentList={wedriveList}
      setSharingMode={_handleSharingMode}
      setConvertFileSize={_handleConvertFileSize}
      getWedriveToken={_handleGetWedriveToken}
    />
  );
};

export default FileListContainer;

const styles = StyleSheet.create({});
