import React from 'react';
import ControlBoxPresenter from './ControlBoxPresenter';
import { getConferenceManager } from '../../../../../utils/ConferenceManager';

class ControlBoxContainer extends React.Component {
  constructor(props) {
    super(props);
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
    if (this.props.isAudioActive) {
      this.props.toggleMuteMic();
    } else {
      if (this.props.isMuteMic) {
        conferenceManager.requestAttention(this.props.name);
        this.props.setSimpleNoti('마스터에게 발언권을 요청하였습니다.')
      } else {
        conferenceManager.stopAttention(this.props.name);
        // this.props.toggleMuteMicByMe();
        this.props.toggleMuteMic();

      }
    }
  };
}

export default ControlBoxContainer;
