import { connect } from "react-redux";
import ConferenceScreenContainer from "./ConferenceScreenContainer";

const mapStateToProps = state => {
  const {
    local: { user },
    mainUser: { mainUserId }
  } = state;

  const mainUser = mainUserId && user;
  return {
    mainUser
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch: dispatch
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConferenceScreenContainer);
