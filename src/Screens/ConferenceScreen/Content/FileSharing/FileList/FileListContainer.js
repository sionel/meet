import React, { Component } from 'react';
import FileListPresenter from './FileListPresenter';

class FileListContainer extends Component {
  constructor(props) {
    super(props);

    this._handleCheckInitInfo();
  }
  render() {
    const { hasNotch, orientation } = this.props;

    const tempList = [
      { key: '1', fileName: 'file 1', ext: 'png', thumbImg: '', fileSize: '13kb' },
      { key: '2', fileName: 'file 2', ext: 'jpg', thumbImg: '', fileSize: '130kb' },
      { key: '3', fileName: 'file 3', ext: 'jpg', thumbImg: '', fileSize: '130kb' },
      { key: '4', fileName: 'file 4', ext: 'jpg', thumbImg: '', fileSize: '130kb' },
      { key: '5', fileName: 'file 5', ext: 'jpg', thumbImg: '', fileSize: '130kb' },
      { key: '6', fileName: 'file 6', ext: 'jpg', thumbImg: '', fileSize: '130kb' },
      { key: '999', fileName: 'filefilefilefilefilefilefilefilefilefilefilefilefilefilefilefilefilefile 3', ext: 'xls', thumbImg: '', fileSize: '1300kb' }
    ];

    return (
      <FileListPresenter
        hasNotch={hasNotch}
        orientation={orientation}
        documentList={tempList}
        setSharingMode={this._handleSharingMode}
        setDocumentListMode={this._handleDocumentListMode}
      />
    );
  }

  /**
   * _handleDocumentListMode
   * 위드라이브 리스트 보기 모드
   */
  _handleDocumentListMode = (mode) => {
    this.props.setDocumentListMode(mode);
  };

  /**
   * _handleSharingMode
   * 위드라이브 문서공유 모드
   */
  _handleSharingMode = (selected) => {
    console.log(selected)
    this.props.setSharingMode(true);
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
      HASH_KEY
    } = this.props.auth;

    const authData = {
      AUTH_A_TOKEN,
      AUTH_R_TOKEN,
      cno: last_access_company_no,
      ccode: last_company.company_code,
      HASH_KEY
    };

    // wedrive token 가져오기
    const initInfoResponse = await this.props.initInfoRequest(authData);
    if (!initInfoResponse.initInfo) {
      alert(
        '사용자 정보를 불러오지 못했습니다.\nerror: ' +
          initInfoResponse.resultCode +
          initInfoResponse.resultMsg
      );
      return;
    }
    console.log('initInfoResponse', initInfoResponse)

    // wedrive file list 가져오기
    const fileListResponse = await this.props.getFileListRequest(
      authData,
      initInfoResponse.initInfo
    );
    console.log('fileListResponse', fileListResponse);

    if (!fileListResponse.fileList) {
      alert(
        '파일 리스트를 불러오지 못했습니다.\nerror: ' +
          fileListResponse.resultCode +
          fileListResponse.resultMsg
      );
      return;
    }

    console.log(fileListResponse.fileList);
  };
}

export default FileListContainer;
