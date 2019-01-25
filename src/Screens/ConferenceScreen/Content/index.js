import { connect } from "react-redux";
import ContentContainer from "./ContentContainer";
import { actionCreators as localActions } from "../../../redux/modules/local";

const mapStateToProps = state => {
  const {
    local: { conferenceMode }
  } = state;

  return {
    conferenceMode
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setConferenceMode: mode => {
      console.log(ownProps);
      return dispatch(localActions.setConferenceMode(mode));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContentContainer);
