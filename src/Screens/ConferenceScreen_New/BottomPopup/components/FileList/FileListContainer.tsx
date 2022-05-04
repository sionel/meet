import React, { useEffect, useState } from 'react';
import { Alert, Animated } from 'react-native';
import FileListPresenter from './FileListPresenter';

import { actionCreators as ConferenceActions } from '@redux/conference';

import { FileListContainerProps } from '@screens/ConferenceScreen_New/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/configureStore';
import { WedriveApi } from '@services/index';
import { useTranslation } from 'react-i18next';
import alert from '@redux/alert';

const FileListContainer: React.FC<FileListContainerProps> = ({}) => {
  const { t } = useTranslation();
  const { auth, room } = useSelector((state: RootState) => ({
    auth: state.user.auth,
    room: state.conference.room
  }));

  const {
    AUTH_A_TOKEN,
    AUTH_R_TOKEN,
    HASH_KEY,
    portal_id,
    last_access_company_no
  } = auth;

  const [loading, setLoading] = useState('INIT');
  const [wedriveList, setWedriveList] = useState<any[]>([]);
  const [token, setToken] = useState('')
  const rotate = new Animated.Value(0);
  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  let pk: any[] = [];
  let TokenID = '';
  
  //#region  dispatch
  const dispatch = useDispatch();

  
  const setBottomDisplayType = () => {
    dispatch(ConferenceActions.setBottomDisplayType('NONE'));
  };
  //#endregion
  
  useEffect(() => {
    init()
  }, []);
  
  const init = async () => {
    setLoading('LOADING');
    
    try {
      const token = await _getWedriveTokenId();
      setToken(token)
      const fileList = await _getFileList(token)
      setWedriveList(fileList)
    } catch (error:string) {
      Alert.alert(error)
    }
    
    setLoading('FINISH');
    
  }

  const handleRefreshList = () => {
    const fileList = _getFileList(token)
    setWedriveList(fileList)
  }

  const getFileList = async () => {
    await _handleGetWedriveTokenId();
    if (TokenID) {
      _handleGetFileList();
    } else {
      Alert.alert(t('alert_title_error'), t('alert_text_fail_user_info'));
      setBottomDisplayType();
    }
  };

  const _handleGetWedriveTokenId = async () => {
    const authData = {
      AUTH_A_TOKEN: AUTH_A_TOKEN,
      AUTH_R_TOKEN: AUTH_R_TOKEN,
      HASH_KEY,
      portalID: `${portal_id}`,
      last_access_company_no
    };

    setLoading('LOADING');

    const tokenResult = await WedriveApi.getToken(
      authData.AUTH_A_TOKEN,
      authData.AUTH_R_TOKEN,
      authData.HASH_KEY,
      authData.portalID
    ); // 매개변수 하나로

    setLoading('FINISH');

    const tokenID = `${tokenResult.resultList[0][last_access_company_no].objectTokenId}@@${AUTH_A_TOKEN}`;
    // TokenID = tokenID;
    if (!tokenID) {
      throw '토큰이 없습니다, 정상이 아닙낟'
    } else {
      return tokenID;
    }
    //TODO: 일단 현재 구조로 봤을때 파일정보를 관해서 리덕스에 저장할 필요가 없어보임.
    // 추후에 해당 정보를 미리 저장해놓기 위해 whiteList 넣을 필요가 있다면 그때 로직 수정

    // setInitInfo(wedriveToken);
  };

  const _handleGetFileList = async () => {
    // wedrive file list 가져오기
    const authData = {
      AUTH_A_TOKEN: AUTH_A_TOKEN,
      AUTH_R_TOKEN: AUTH_R_TOKEN,
      HASH_KEY,
      portalID: `${portal_id}`,
      last_access_company_no
    };

    setLoading('LOADING');
    const fileListResult = await WedriveApi.getList(authData, TokenID);
    setLoading('FINISH');

    // 이름 순으로 정렬
    const sortedList = await fileListResult.resultList.sort(
      (a: any, b: any) => {
        if (a.directory) return -1;
        if (b.directory) return 1;
        return a.fileName > b.fileName ? 1 : -1;
      }
    );
  const _getFileList = async (token:string) => {
    // wedrive file list 가져오기
    const authData = {
      AUTH_A_TOKEN: AUTH_A_TOKEN,
      AUTH_R_TOKEN: AUTH_R_TOKEN,
      HASH_KEY,
      portalID: `${portal_id}`,
      last_access_company_no
    };

    setLoading('LOADING');
    const fileListResult = await WedriveApi.getList(authData, TokenID);
    setLoading('FINISH');

    // 이름 순으로 정렬
    const sortedList = await fileListResult.resultList.sort(
      (a: any, b: any) => {
        if (a.directory) return -1;
        if (b.directory) return 1;
        return a.fileName > b.fileName ? 1 : -1;
      }
    );

    setWedriveList(sortedList);

    if (sortedList.length === 0) {
      // Alert.alert(t('alert_title_error'), t('alert_text_fail_file_list'));
      throw  t('alert_text_fail_file_list')
    }else {
      return sortedList
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
      TokenID,
      FileUniqueKey: preFolder || directory.fileUniqueKey,
      fileUniqueKey: preFolder || directory.fileUniqueKey,
      parentFileUniqueKey: directory.parentFileUniqueKey,
      path: portal_id + '@'
    };

    setLoading('LOADING');

    const fileListResult = await WedriveApi.getDirectoryInfo(
      authData,
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
      TokenID,
      method: method
    };

    setLoading('FILE_LOADING');
    const fileListResult = await WedriveApi.getFileInfo(authData, fileInfo);
    setLoading('FINISH');

    // setFileInfo(fileListResult.resultList);

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

  const getExtentionType = (fileName: any) => {
    const ext = fileName.split('.').pop().toLowerCase();
    return ext;
  };



  return (
    <FileListPresenter
      isLoading={loading}
      documentList={wedriveList}
      spin={spin}
      setSharingMode={_handleSharingMode}
      setConvertFileSize={_handleConvertFileSize}
      getWedriveToken={_handleGetWedriveTokenId}
      getExtentionType={getExtentionType}
      t={t}
    />
  );
};

export default FileListContainer;
