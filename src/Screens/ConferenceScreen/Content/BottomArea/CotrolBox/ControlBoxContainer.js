import React from 'react';
import ControlBoxPresenter from './ControlBoxPresenter';
import { getConferenceManager } from '@utils/ConferenceManager';
import { getT } from '@utils/translateManager';
class ControlBoxContainer extends React.Component {
  constructor(props) {
    super(props);
    this.t = getT();
  }

  render() {
    return (
      <ControlBoxPresenter
        {...this.props}
        toggleMuteMic={this._handleToggleMic}
        // callType={this.props.callType}
        // speaker={this.props.speaker}
        // onClose={this.props.onClose}
        // onChangeSpeaker={this.props.onChangeSpeaker}
        // toggleMuteSpeaker={this.props.toggleMuteSpeaker}
        // toggleMuteVideo={this.props.toggleMuteVideo}
        // isMuteSpeaker={this.props.isMuteSpeaker}
        // isMuteVideo={this.props.isMuteVideo}
        // isMuteMic={this.props.isMuteMic}
        // isScreenShare={this.props.isScreenShare}
      />
    );
  }

  _handleToggleMic = () => {
    let conferenceManager = getConferenceManager();
    const {
      isMasterControl,
      isAudioActive,
      isMuteMic,
      isMicRequest,
      name,
      setToastMessage,
      setMicRequest,
      toggleMuteMic
    } = this.props;

    if (isMasterControl) {
      if (isAudioActive) {
        // 참가자는 마스터가 제어중일때 오디오가 꺼져있으면 직접 컨트롤 할 수 없음
      } else {
        if (isMuteMic) {
          if (isMicRequest) {
            setToastMessage(this.t('toast_master_waiting'));
          } else {
            conferenceManager.requestAttention(name);
            setMicRequest(true);
            setToastMessage(this.t('toast_master_ask'));
          }
        } else {
          conferenceManager.stopAttention(name);
          setToastMessage(this.t('toast_master_finish'));
          toggleMuteMic();
        }
      }
    } else {
      toggleMuteMic();
    }
  };
}

export default ControlBoxContainer;
