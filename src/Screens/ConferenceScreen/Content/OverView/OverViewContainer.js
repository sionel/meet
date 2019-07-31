import React, { Component } from 'react';
import OverViewPresenter from './OverViewPresenter';

class OverViewContainer extends Component {
  state = { view: this.props.defaultMode };

  constructor(props) {
    super(props);
  }

  render() {
    const { mode, hasNotch, orientation, onChangeSharingMode } = this.props;
    const { view } = this.state;
    const tabs = [
      { key: 'USERLIST', name: '참여자 목록' },
      { key: 'FILELIST', name: 'WE드라이브 파일' }
    ];

    let selectedTabs = [];
    tabs.map(t => {
      mode.map(m => {
        t.key === m && selectedTabs.push(t);
      });
    });

    return (
      <OverViewPresenter
        view={view}
        tabs={selectedTabs}
        // hasNotch={hasNotch}
        orientation={orientation}
        speaker={this.props.speaker}
        setDocumentListMode={this._handleDocumentListMode}
        onChangeSharingMode={onChangeSharingMode}
        onChangeState={this._handleChangeState}
        onChangeSpeaker={this.props.onChangeSpeaker}
      />
    );
  }

  /**
   * _handleChangeState
   */
  _handleChangeState = (state, value) => {
    this.setState({ [state]: value });
  };

  /**
   * _handleDocumentListMode
   * 위드라이브 리스트 보기 모드
   */
  _handleDocumentListMode = mode => {
    this.props.setDocumentListMode(mode);
  };
}

export default OverViewContainer;
