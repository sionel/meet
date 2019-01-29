import { connect } from "react-redux";
import ConferenceScreenContainer from "./ConferenceScreenContainer";

const mapStateToProps = state => {
  const {
    local: { user },
    mainUser: { mainUserId },
    participants: { list }
  } = state;

  const mainUser = getMainUser(mainUserId, user, list);
  return {
    mainUser
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch: dispatch
  };
};

const getMainUser = (mainUserId, localUser, participants) => {
  if (!localUser) {
    return null;
  } else if (mainUserId === localUser.id) {
    return localUser;
  } else {
    return participants.find(participant => participant.id === mainUserId);
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConferenceScreenContainer);
