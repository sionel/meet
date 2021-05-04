import React, { Component } from 'react';
import FileListPresenter from './FileListPresenter';
import { getT } from '../../../../../utils/translateManager';
class FileListContainer extends Component {
  constructor(props) {
    super(props);
    this.pk = []; // 폴더 depth 를 기록
    this.t = getT();
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
        documentList={this.props.wedriveList}
        setSharingMode={this._handleSharingMode}
        setConvertFileSize={this._handleConvertFileSize}
        getWedriveToken={this._handleGetWedriveToken}
      />
    );
  }

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

  _handleDocumentListMode = mode => {
    this.props.setDocumentListMode(mode);
  };

  _handleSharingMode = file => {
    this._handleGetFileInfo(file);
  };

  _handleGetWedriveToken = async () => {
    const {
      AUTH_A_TOKEN,
      AUTH_R_TOKEN,
      HASH_KEY,
      portal_id,
      last_access_company_no
    } = this.props.auth;

    const authData = {
      AUTH_A_TOKEN,
      AUTH_R_TOKEN,
      HASH_KEY,
      portalID: `${portal_id}`,
      last_access_company_no
    };

    const initInfoResponse = await this.props.initInfoRequest(
      authData,
      last_access_company_no
    );
    if (!initInfoResponse.initInfo) {
      this.props.setAlert({
        type: 1,
        title: this.t('alert_title_error'),
        message: this.t('alert_text_fail_user_info')
      });
      this._handleDocumentListMode(false);
      return;
    } else {
      await this._handleGetFileList(authData);
    }
  };

  _handleGetFileList = async authData => {
    const { TokenID } = this.props;

    // wedrive file list 가져오기
    const fileListResponse = await this.props.getFileListRequest(
      authData,
      TokenID
    );

    if (!fileListResponse.storageList) {
      this.props.setAlert({
        type: 1,
        title: this.t('alert_title_error'),
        message: this.t('alert_text_fail_file_list')
      });
      return;
    }
  };

  _handleGetDirectoryInfo = async directory => {
    const { AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY, portal_id } = this.props.auth;
    const { TokenID } = this.props;

    const authData = {
      AUTH_A_TOKEN,
      AUTH_R_TOKEN,
      HASH_KEY
    };

    let preFolder = '';
    if (directory.preFolder) {
      preFolder = this.pk.pop();
    } else {
      this.pk.push(directory.parentFileUniqueKey);
    }

    const directoryInfo = {
      TokenID: TokenID,
      FileUniqueKey: preFolder || directory.fileUniqueKey,
      fileUniqueKey: preFolder || directory.fileUniqueKey,
      parentFileUniqueKey: directory.parentFileUniqueKey,
      path: portal_id + '@'
    };

    await this.props.getDirectoryInfoRequest(authData, directoryInfo);
  };

  _handleGetFileInfo = async file => {
    if (file.size > 1024 * 1024 * 20) {
      this.props.setAlert({
        type: 1,
        title: this.t('alert_title_size_over'),
        message: this.t('alert_text_fail_share_file_size')
      });
      return;
    }

    const {
      AUTH_A_TOKEN,
      AUTH_R_TOKEN,
      HASH_KEY,
      last_access_company_no
    } = this.props.auth;
    const { TokenID } = this.props;

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
        this._handleGetDirectoryInfo(file);
        return;
      default:
        this.props.setAlert({
          type: 1,
          title: this.t('alert_title_unsupported'),
          message: this.t('alert_text_unsupported_doc')
        });
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
      this.props.setAlert({
        type: 1,
        title: this.t('alert_title_conversion'),
        message: this.t('alert_text_wait')
      });
      return;
    }
    this.props.setAlert({
      type: 1,
      title: this.t('alert_title_loading_fail'),
      message: this.t('alert_text_wait')
    });
    return;
  };

  _handleChangeSharingMode = fileName => {
    const {
      fileInfo,
      auth: { portal_id }
    } = this.props;

    let resources = [];
    if (typeof fileInfo[0] === 'string') {
      // 이미지 리소스가 1개 일 때는 배열로 안줌
      resources = fileInfo;
    } else if (!fileInfo[0].resources) {
      // 이미지 리소스가 없을 시
      this.props.setAlert({
        type: 1,
        title: this.t('alert_title_loading_fail'),
        message: this.t('alert_text_wait')
      });
      return;
    } else {
      // 이미지 리소스가 여러개일 경우
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
