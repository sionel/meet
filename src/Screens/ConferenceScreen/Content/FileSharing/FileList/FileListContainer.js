import React, { Component } from 'react';
import { Alert, Image } from 'react-native';
import FileListPresenter from './FileListPresenter';

class FileListContainer extends Component {
  constructor(props) {
    super(props);

    this._handleGetWedriveToken();
  }

  render() {
    const { hasNotch, orientation } = this.props;
    return (
      <FileListPresenter
        hasNotch={hasNotch}
        orientation={orientation}
        documentList={this.props.wedriveList}
        // documentList={tempList}
        setSharingMode={this._handleSharingMode}
        setDocumentListMode={this._handleDocumentListMode}
        setConvertFileSize={this._handleConvertFileSize}
      />
    );
  }

  /**
   * 용량 표시 설정
   */
  _handleConvertFileSize = byte => {
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

  /**
   * _handleDocumentListMode
   * 위드라이브 리스트 보기 모드
   */
  _handleDocumentListMode = mode => {
    this.props.setDocumentListMode(mode);
  };

  /**
   * _handleSharingMode
   * 위드라이브 문서공유 모드
   */
  _handleSharingMode = async file => {
    await this._handleGetFileInfo(file);
    // this.props.setSharingMode(true);
  };

  /**
   * _handleGetWedriveToken
   * 위드라이브 토큰 가져오기
   */
  _handleGetWedriveToken = async () => {
    const { AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY, portal_id } = this.props.auth;

    const authData = {
      AUTH_A_TOKEN,
      AUTH_R_TOKEN,
      HASH_KEY,
      portalID: `${portal_id}`
    };

    // wedrive token 가져오기
    const initInfoResponse = await this.props.initInfoRequest(authData);
    if (!initInfoResponse.initInfo) {
      Alert.alert('Error', '사용자 정보를 불러오지 못했습니다.', [
        { text: 'OK' }
      ]);
      this._handleDocumentListMode(false);
      return;
    } else {
      this._handleGetFileList(authData);
    }
  };

  _handleGetFileList = async authData => {
    // alert(JSON.stringify(initInfoResponse));
    const { TokenID } = this.props;

    // wedrive file list 가져오기
    const fileListResponse = await this.props.getFileListRequest(
      authData,
      TokenID
    );

    if (!fileListResponse.storageList) {
      Alert.alert('Error', '파일 리스트를 불러오지 못했습니다.', [
        { text: 'OK' }
      ]);
      return;
    }
  };

  /**
   * _handleGetFileInfo
   * 파일 정보 가져오기
   */
  _handleGetFileInfo = async file => {
    const { AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY } = this.props.auth;
    const { TokenID } = this.props;

    const authData = {
      AUTH_A_TOKEN,
      AUTH_R_TOKEN,
      HASH_KEY
    };

    const extentionType = file.directory
      ? 'directory'
      : file.fileName
          .split('.')
          .pop()
          .toLowerCase();
    let method = '';

    switch (extentionType) {
      case 'txt':
      case 'one':
      case 'hwp':
      case 'ppt':
      case 'pptx':
      case 'show':
      case 'rtf':
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
        method = 'getImageURL';
        break;
      case 'pdf':
        method = 'getAttachmentsPublicURL';
        break;
      case 'directory':
        alert('directory');
        return;
      default:
        Alert.alert('경고', '지원하지 않는 파일 확장자입니다.', [
          { text: 'OK' }
        ]);
        return;
    }

    const fileInfo = {
      Ext: extentionType,
      FileName: file.fileUniqueKey,
      FileUniqueKey: file.fileUniqueKey,
      cno: 9,
      target_cno: 9,
      ServiceCode: 'wedrive',
      ServiceKey: '',
      BucketType: 'C',
      BucketName: 'undefined',
      isWedrive: 'true',
      isFullPreview: 'true',
      TokenID: TokenID,
      method: method
    };

    // wedrive file 상세정보 가져오기
    const fileInfoResponse = await this.props.getFileInfoRequest(
      authData,
      fileInfo
    );

    if (fileInfoResponse.fileInfo) {
      if (fileInfoResponse.fileInfo.length > 0) {
        this._handleChangeSharingMode(file.fileName);
        return;
      }
    }

    Alert.alert('Error', '파일 상세정보를 불러오지 못했습니다.', [
      { text: 'OK' }
    ]);
    return;
  };

  _handleChangeSharingMode = fileName => {
    const {
      fileInfo,
      auth: { portal_id }
    } = this.props;

    let resources = [];
    if (typeof fileInfo[0] === 'string') {
      resources = fileInfo;
    } else {
      console.log(fileInfo);
      resources = fileInfo[0].resources;
    }
    this.props.onChangeSharingMode(
      {
        fileName: fileName,
        owner: portal_id,
        resources: JSON.stringify(resources)
      },
      true
    );
  };
}

export default FileListContainer;
