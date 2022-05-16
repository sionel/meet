import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';

import FileListPresenter from './FileListPresenter';
import { FileListContainerProps } from '@screens/ConferenceScreen/types';

import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/configureStore';

import { WedriveApi } from '@services/index';

const FileListContainer: React.FC<FileListContainerProps> = ({}) => {
  const { t } = useTranslation();
  const { auth } = useSelector((state: RootState) => ({
    auth: state.user.auth
  }));

  const [loading, setLoading] = useState('INIT');
  const [wedriveList, setWedriveList] = useState<any[]>([]);
  const [token, setToken] = useState('');

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setLoading('LOADING');
    try {
      const tokenID = await _getWedriveTokenId();
      setToken(tokenID);
      const fileList = await _getFileList(tokenID);
      setWedriveList(fileList);
    } catch (error: any) {
      Alert.alert(error);
    }
    setLoading('FINISH');
  };

  const handleRefreshList = async () => {
    const fileList = await _getFileList(token);
    setWedriveList(fileList);
  };

  const _getWedriveTokenId = async () => {
    const { last_access_company_no, AUTH_A_TOKEN } = auth;
    setLoading('LOADING');
    const tokenResult = await WedriveApi.getToken(auth);
    setLoading('FINISH');
    const tokenID = `${tokenResult.resultList[0][last_access_company_no].objectTokenId}@@${AUTH_A_TOKEN}`;
    if (!tokenID) {
      throw '계정에 대한 토큰 정보가 없습니다.';
    } else {
      return tokenID;
    }
    //TODO: 일단 현재 구조로 봤을때 파일정보를 관해서 리덕스에 저장할 필요가 없어보임.
    // 추후에 해당 정보를 미리 저장해놓기 위해 whiteList 넣을 필요가 있다면 그때 로직 수정
    // setInitInfo(wedriveToken);
  };

  // wedrive file list 가져오기
  const _getFileList = async (token: string) => {
    setLoading('LOADING');
    const fileListResult = await WedriveApi.getList(auth, token);
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
    if (sortedList.length > 0) {
      return sortedList;
    } else {
      throw t('alert_text_fail_file_list');
    }
  };

  return (
    <FileListPresenter
      isLoading={loading}
      documentList={wedriveList}
      TokenID={token}
      onRefreshList={handleRefreshList}
      setLoading={setLoading}
      setWedriveList={setWedriveList}
      t={t}
    />
  );
};

export default FileListContainer;
