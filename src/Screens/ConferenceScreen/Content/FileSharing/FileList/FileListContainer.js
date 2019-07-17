import React, { Component } from 'react';
import { Alert, Image } from 'react-native';
import FileListPresenter from './FileListPresenter';

class FileListContainer extends Component {
  constructor(props) {
    super(props);

    this._handleCheckInitInfo();
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
      />
    );
  }

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
   * _handleCheckInitInfo
   * 위드라이브 파일 리스트 가져오기
   */
  _handleCheckInitInfo = async () => {
    const {
      AUTH_A_TOKEN,
      AUTH_R_TOKEN,
      last_access_company_no,
      last_company,
      HASH_KEY,
      portal_id
    } = this.props.auth;

    const authData = {
      AUTH_A_TOKEN,
      AUTH_R_TOKEN,
      cno: last_access_company_no,
      ccode: last_company.company_code,
      HASH_KEY,
      portalID: `${portal_id}`
    };

    // wedrive token 가져오기
    const initInfoResponse = await this.props.initInfoRequest(authData);
    console.log(initInfoResponse)
    if (!initInfoResponse.initInfo) {
      Alert.alert(
        'Error',
        '사용자 정보를 불러오지 못했습니다.\nerror: ' +
          initInfoResponse.resultCode +
          initInfoResponse.resultMsg,
        [{ text: 'OK' }]
      );
      this._handleDocumentListMode(false);
      return;
    }
    // alert(JSON.stringify(initInfoResponse));

    // wedrive file list 가져오기
    const fileListResponse = await this.props.getFileListRequest(
      authData,
      initInfoResponse.initInfo
    );

    if (!fileListResponse.fileList) {
      Alert.alert(
        'Error',
        '파일 리스트를 불러오지 못했습니다.\nerror: ' +
          fileListResponse.resultCode +
          fileListResponse.resultMsg,
        [{ text: 'OK' }]
      );
      return;
    }
    // alert(JSON.stringify(fileListResponse));
  };

  /**
   * _handleGetFileInfo
   * 파일 정보 가져오기
   */
  _handleGetFileInfo = async file => {
    const {
      AUTH_A_TOKEN,
      AUTH_R_TOKEN,
      last_access_company_no,
      last_company,
      HASH_KEY
    } = this.props.auth;

    const authData = {
      AUTH_A_TOKEN,
      AUTH_R_TOKEN,
      cno: last_access_company_no,
      ccode: last_company.company_code,
      HASH_KEY
    };

    let method = file.extentionType.toLowerCase();

    switch (method) {
      case 'txt':
      case 'one':
      case 'hwp':
      case 'ppt':
      case 'pptx':
      case 'show':
      case 'rtf':
      case 'docx':
      case 'xls':
      case 'xlsx':
        method = 'getOfficePreView';
        break;
      case 'bmg':
      case 'jpg':
      case 'jpeg':
      case 'jif':
      case 'png':
        method = 'getImageURL';
        break;
      case 'pdf':
        method = 'getAttachmentsPublicURL';
        break;
      default:
        Alert.alert('경고', '지원하지 않는 파일 확장자입니다.', [
          { text: 'OK' }
        ]);
        return;
    }

    const fileInfo = {
      // Ext: file.extentionType,
      FileUniqueKey: file.fileUniqueKey,
      // cno: authData.cno,
      // target_cno: authData.cno,
      // ServiceCode: 'wedrive',
      // ServiceKey: '',
      // BucketType: 'C',
      // BucketName: undefined,
      // isWedrive: false,
      // isFullPreview: false,
      TokenID: this.props.wedriveId,
      service: 'storageService',
      method: 'getFileInfoObject',
      locale: 'ko'
    };

    // wedrive file 상세정보 가져오기
    const fileInfoResponse = await this.props.getFileInfoRequest(
      authData,
      fileInfo
    );
    if (fileInfoResponse.errors) {
      Alert.alert(
        'Error',
        '파일 상세정보를 불러오지 못했습니다.\nerror: ' +
          fileInfoResponse.errors.code +
          fileInfoResponse.errors.message,
        [{ text: 'OK' }]
      );
      // return;
    }

    this.props.onChangeSharingMode(
      {
        fileName: '테스트.xlsx',
        owner: 'peacejung',
        resources:
          '["https://api.wehago.com/hermes/resource/store/1e/c0/d6a8ebb79e382f974e6e405433862f452b56/document_0001.jpg","https://api.wehago.com/hermes/resource/store/1e/c0/d6a8ebb79e382f974e6e405433862f452b56/document_0002.jpg","https://api.wehago.com/hermes/resource/store/1e/c0/d6a8ebb79e382f974e6e405433862f452b56/document_0003.jpg","https://api.wehago.com/hermes/resource/store/1e/c0/d6a8ebb79e382f974e6e405433862f452b56/document_0004.jpg"]'
      },
      true
    );
  };
}

export default FileListContainer;
