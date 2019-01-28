import { connect } from "react-redux";
import TopAreaContainer from "./TopAreaContainer";
import { actionCreators as localActionCreators } from "../../../../redux/modules/local";

const mapStateToProps = state => {
  const { local } = state;

  return {
    conferenceMode: local.conferenceMode,
    isMuteVideo: local.user.isMuteVideo
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleCameraFacingMode: () =>
      dispatch(localActionCreators.toggleCameraFacingMode())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopAreaContainer);
