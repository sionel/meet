import React from "react";
import ContentPresenter from "./ContentPresenter";
import { ConferenceModes } from "../../../utils/Constants";

const modes = {
  NORMAL: "normal",
  CONTROL: "control"
};

/**
 * ContentContainer : 화상대화 화면
 */
class ContentContainer extends React.Component {
  render() {
    const { mainUser } = this.props;
    const stream =
      mainUser.videoTrack && mainUser.videoTrack.getOriginalStream();
    return (
      <ContentPresenter
        {...this.props}
        stream={stream}
        toggleConferenceMode={this._toggleConferenceMode}
      />
    );
  }

  _toggleConferenceMode = () => {
    const { setConferenceMode, conferenceMode } = this.props;
    if (conferenceMode === ConferenceModes.CONTROL) {
      setConferenceMode(ConferenceModes.NORMAL);
    } else {
      setConferenceMode(ConferenceModes.CONTROL);
    }
  };
}

export default ContentContainer;
