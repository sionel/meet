import { connect } from "react-redux";
import SubVideoBoxContainer from "./SubVideoBoxContainer";

const mapStateToProps = state => {
  const {
    local: { user },
    mainUser: { mainUserId }
  } = state;

  return {
    mainUserId,
    user
  };
};

export default connect(
  mapStateToProps,
  null
)(SubVideoBoxContainer);
