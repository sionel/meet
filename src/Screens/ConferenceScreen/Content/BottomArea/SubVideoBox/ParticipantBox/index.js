import { connect } from "react-redux";
import ParticipantBoxContainer from "./ParticipantBoxContainer";
import { actionCreators as mainUserActionCreators } from "../../../../../../redux/modules/mainUser";

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setMainUser: id => {
      return dispatch(mainUserActionCreators.setMainUser(id));
    }
  };
};

export default connect(
  null,
  mapDispatchToProps
)(ParticipantBoxContainer);
