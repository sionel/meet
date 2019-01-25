import { connect } from "react-redux";
import BottomAreaContainer from "./BottomAreaContainer";

const mapStateToProps = state => {
  const {
    local: { conferenceMode }
  } = state;

  return { conferenceMode };
};

export default connect(
  mapStateToProps,
  null
)(BottomAreaContainer);
