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
        {...this.props}
        toggleMuteMic={this.props.handleToggleMic}
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
}

export default ControlBoxContainer;
