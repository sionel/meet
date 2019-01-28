import { connect } from "react-redux";
import ControlBoxContainer from "./ControlBoxContainer";
import { actionCreators as localActionCreators } from "../../../../../redux/modules/local";

const mapStateToProps = state => {
  const { local } = state;
  return {
    local
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleMuteVideo: () => dispatch(localActionCreators.toggleMuteVideo())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ControlBoxContainer);
