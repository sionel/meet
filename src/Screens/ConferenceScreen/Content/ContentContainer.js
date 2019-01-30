import React from "react";
import { Dimensions, NativeModules } from "react-native";
import ContentPresenter from "./ContentPresenter";
import { ConferenceModes } from "../../../utils/Constants";
const { AudioMode } = NativeModules;
/**
 * ContentContainer : 화상대화 화면
 */
class ContentContainer extends React.Component {
  state = {
    orientation:
      Dimensions.get("window").height > Dimensions.get("window").width
        ? "vertical"
        : "horizontal"
  };

  componentDidMount() {
    AudioMode.setMode(AudioMode.VIDEO_CALL);
  }

  render() {
    return (
      <ContentPresenter
        {...this.state}
        {...this.props}
        toggleConferenceMode={this._toggleConferenceMode}
        onLayout={this._setOrientation}
      />
    );
  }

  /**
   * 대화 모드(참여자가 보일지 / 컨트롤 버튼이 보일지) 변경
   */
  _toggleConferenceMode = () => {
    const { setConferenceMode, conferenceMode } = this.props;
    if (conferenceMode === ConferenceModes.CONTROL) {
      setConferenceMode(ConferenceModes.NORMAL);
    } else {
      setConferenceMode(ConferenceModes.CONTROL);
    }
  };

  /**
   * 방향을 지정한다.
   */
  _setOrientation = () => {
    const { orientation } = this.state;
    const currentOrientation =
      Dimensions.get("window").height > Dimensions.get("window").width
        ? "vertical"
        : "horizontal";
    console.log(currentOrientation);
    if (orientation !== currentOrientation) {
      this.setState({ orientation: currentOrientation });
    }
  };
}

export default ContentContainer;
