import React, { Component } from 'react';
import { Alert, Image } from 'react-native';
import FileListPresenter from './FileListPresenter';

class FileListContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    this.getFileList();
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    if (nextProps.isLoading === 'FILE_LOADING') return false;
    return true;
  };

  getFileList = async () => {
    await this._handleGetWedriveToken();
  };

  render() {
    const { isLoading } = this.props;

    return (
      <FileListPresenter
        isLoading={isLoading}
        // hasNotch={hasNotch}
        // orientation={orientation}
        documentList={this.props.wedriveList}
        setSharingMode={this._handleSharingMode}
        setConvertFileSize={this._handleConvertFileSize}
        getWedriveToken={this._handleGetWedriveToken}
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
  _handleSharingMode = file => {
    this._handleGetFileInfo(file);
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
      await this._handleGetFileList(authData);
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
   * _handleGetDirectoryInfo
   * 폴더 정보 가져오기
   */
  _handleGetDirectoryInfo = async directory => {
    const { AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY, portal_id } = this.props.auth;
    const { TokenID } = this.props;

    const authData = {
      AUTH_A_TOKEN,
      AUTH_R_TOKEN,
      HASH_KEY
    };

    const directoryInfo = {
      TokenID: TokenID,
      FileUniqueKey: directory.fileUniqueKey,
      fileUniqueKey: directory.fileUniqueKey,
      parentFileUniqueKey: directory.parentFileUniqueKey,
      path: portal_id + '@'
    };

    await this.props.getDirectoryInfoRequest(authData, directoryInfo);
  };

  /**
   * _handleGetFileInfo
   * 파일 정보 가져오기
   */
  _handleGetFileInfo = async file => {
    if (file.size > 1024 * 1024 * 10) {
      Alert.alert(
        '공유 파일 용량 초과',
        '공유 가능한 파일 용량을 초과하였습니다.\n10MB 이하의 파일을 선택해주세요.',
        [{ text: 'OK' }]
      );
      return;
    }

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
        this._handleGetDirectoryInfo(file);
        return;
      default:
        Alert.alert(
          '지원하지 않는 확장자',
          '해당 파일은 문서 공유를 지원하지 않습니다.',
          [{ text: 'OK' }]
        );
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

    // const isCanceled = setInterval(() => {
    //   if (
    //     this.props.isLoading === 'CANCELED' ||
    //     this.props.isLoading === 'FINISH'
    //   ) {
    //     clearInterval(isCanceled);
    //   }
    // }, 100);

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

    if (fileInfoResponse.resultCode === 'E2021') {
      Alert.alert('파일 변환 중입니다.', '잠시후 다시 시도해주시기 바랍니다.', [
        { text: 'OK' }
      ]);
      return;
    }

    Alert.alert(
      '파일 상세정보를 불러오지 못했습니다.',
      '다시 시도해주시기 바랍니다.',
      [{ text: 'OK' }]
    );
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
      resources = fileInfo[0].resources;
    }
    this.props.onChangeSharingMode({
      fileName: fileName,
      owner: portal_id,
      resources: JSON.stringify(resources)
    });
  };
}

export default FileListContainer;
