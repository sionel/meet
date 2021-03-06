import { connect } from "react-redux";
import ParticipantBoxContainer from "./ParticipantBoxContainer";
import { actionCreators as mainUserActionCreators } from "../../../../../../redux/modules/mainUser";

const mapStateToProps = (state, ownProps) => {
  const {
    user,
    user: { isMuteVideo, isMuteAudio, isMuteMic },
    user: { videoTrack },
    isSelect
  } = ownProps;

  return { user, isMuteVideo, isMuteAudio, isMuteMic, videoTrack, isSelect };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setMainUser: id => {
      return dispatch(mainUserActionCreators.setMainUser(id));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ParticipantBoxContainer);
