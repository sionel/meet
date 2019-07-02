import React, { Component } from 'react';
import FileListPresenter from './FileListPresenter';

class FileListContainer extends Component {
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
        setDocumentListMode={this._handleDocumentListMode}
      />
    );
  }

  _handleDocumentListMode = (mode) => {
    this.props.setDocumentListMode(mode);
  };
}

export default FileListContainer;
