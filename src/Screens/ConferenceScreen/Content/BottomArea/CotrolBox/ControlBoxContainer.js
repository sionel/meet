import React from 'react';
import ControlBoxPresenter from './ControlBoxPresenter';

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
    if (this.props.isMasterControl) {
      this.props.onChangeMicMaster()
    } else {
      this.props.toggleMuteMic()
    }
  };
}

export default ControlBoxContainer;
