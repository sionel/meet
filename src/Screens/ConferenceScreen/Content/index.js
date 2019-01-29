import { connect } from "react-redux";
import ContentContainer from "./ContentContainer";
import { actionCreators as localActions } from "../../../redux/modules/local";

const mapStateToProps = (state, ownProps) => {
  const {
    local: { conferenceMode }
  } = state;

  const { mainUser } = ownProps;

  return {
    conferenceMode,
    videoTrack: mainUser.videoTrack,
    isMuteVideo: mainUser.isMuteVideo
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setConferenceMode: mode => {
      return dispatch(localActions.setConferenceMode(mode));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContentContainer);
