import React from "react";
import ContentPresenter from "./ContentPresenter";
import { ConferenceModes } from "../../../utils/Constants";

/**
 * ContentContainer : 화상대화 화면
 */
class ContentContainer extends React.Component {
  render() {
    return (
      <ContentPresenter
        {...this.props}
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
