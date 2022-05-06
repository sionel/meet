import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import { WedriveApi } from '@services/index';

import { actionCreators as ConferenceActions } from '@redux/conference';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/configureStore';

import FileCardPresenter from './FileCardPresenter';
import { FileCardContainerProps } from '@screens/ConferenceScreen_New/types';

const FileCardContainer: React.FC<FileCardContainerProps> = ({
  file,
  TokenID,
  setLoading,
  setWedriveList
}) => {
  const { t } = useTranslation();

  const { auth, last_access_company_no, portal_id, room } = useSelector(
    (state: RootState) => ({
      auth: state.user.auth,
      last_access_company_no: state.user.auth.last_access_company_no,
      portal_id: state.user.auth.portal_id,
      room: state.conference.room
    })
  );

  //#region  dispatch
  const dispatch = useDispatch();

  const setBottomDisplayType = () => {
    dispatch(ConferenceActions.setBottomDisplayType('NONE'));
  };
  //#endregion

  let pk: any[] = [];

  const _handlePressFile = async (file: any) => {
    if (file.size > 1024 * 1024 * 20) {
      Alert.alert(
        t('alert_title_size_over'),
        t('alert_text_fail_share_file_size')
      );
      return;
    }
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
      TokenID,
      method: method
    };
    setLoading('FILE_LOADING');
    const fileListResult = await WedriveApi.getFileInfo(auth, fileInfo);
    setLoading('FINISH');
    if (fileListResult.resultList.length > 0) {
      _handleChangeSharingMode(fileListResult.resultList, file.fileName);
      return;
    }
    if (fileListResult.resultCode === 'E2021') {
      Alert.alert(t('alert_title_conversion'), t('alert_text_wait'));
      return;
    }
    Alert.alert(t('alert_title_loading_fail'), t('alert_text_wait'));
    return;
  };

  const _handleChangeSharingMode = (fileInfo: any, fileName: any) => {
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
    setBottomDisplayType();
  };

  const _handleGetDirectoryInfo = async (directory: any) => {
    let preFolder = '';
    if (directory.preFolder) {
      preFolder = pk.pop();
    } else {
      pk.push(directory.parentFileUniqueKey);
    }
    const directoryInfo = {
      TokenID,
      FileUniqueKey: preFolder || directory.fileUniqueKey,
      fileUniqueKey: preFolder || directory.fileUniqueKey,
      parentFileUniqueKey: directory.parentFileUniqueKey,
      path: portal_id + '@'
    };
    setLoading('LOADING');
    const fileListResult = await WedriveApi.getDirectoryInfo(
      auth,
      directoryInfo
    );
    setLoading('FINISH');
    const sortedList = await fileListResult.resultList.sort(
      (a: any, b: any) => {
        if (a.directory) return -1;
        if (b.directory) return 1;
        return a.fileName > b.fileName ? 1 : -1;
      }
    );
    let newList = sortedList.list.slice(0);
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
    setWedriveList(newList);
  };

  const _setConvertFileSize = (byte: any) => {
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

  const _getExtentionType = (fileName: any) => {
    const ext = fileName.split('.').pop().toLowerCase();
    return ext;
  };

  return (
    <FileCardPresenter
      file={file}
      onPressFile={_handlePressFile}
      ExtentionType={_getExtentionType}
      ConvertFileSize={_setConvertFileSize}
    />
  );
};

export default FileCardContainer;
