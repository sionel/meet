import React from 'react';
import ControlBoxPresenter from './ControlBoxPresenter';
import { getConferenceManager } from '../../../../../utils/ConferenceManager';
import { getT } from '../../../../../utils/translateManager';
class ControlBoxContainer extends React.Component {
  constructor(props) {
    super(props);
    this.t = getT();
  }

  render() {
    return (
      <ControlBoxPresenter
        callType={this.props.callType}
        speaker={this.props.speaker}
        onClose={this.props.onClose}
        onChangeSpeaker={this.props.onChangeSpeaker}
        toggleMuteSpeaker={this.props.toggleMuteSpeaker}
        toggleMuteVideo={this.props.toggleMuteVideo}
        toggleMuteMic={this._handleToggleMic}
        isMuteSpeaker={this.props.isMuteSpeaker}
        isMuteVideo={this.props.isMuteVideo}
        isMuteMic={this.props.isMuteMic}
      />
    );
  }

  _handleToggleMic = () => {
    let conferenceManager = getConferenceManager();
    if (this.props.isMasterControl && !this.props.isAudioActive) {
      if (this.props.isMuteMic) {
        if (this.props.isMicRequest) {
          this.props.setToastMessage(t('toast.master.요청대기'));
        } else {
          conferenceManager.requestAttention(this.props.name);
          this.props.setMicRequest(true);
          this.props.setToastMessage(t('toast.master.요청'));
        }
      } else {
        conferenceManager.stopAttention(this.props.name);
        this.props.setToastMessage(t('toast.master.발언종료'));
        this.props.toggleMuteMic();
      }
    } else {
      this.props.toggleMuteMic();
    }
  };
}

export default ControlBoxContainer;
