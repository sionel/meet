import { connect } from 'react-redux';
import ControlBoxContainer from './ControlBoxContainer';
import { actionCreators as localActionCreators } from '../../../../../redux/modules/local';

const mapStateToProps = state => {
  const { local } = state;
  return {
    isMuteVideo: local.user.isMuteVideo,
    isMuteMic: local.user.isMuteMic,
    isMuteSpeaker: local.user.isMuteSpeaker,
    isMasterControl: local.isMasterControl
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleMuteVideo: () => dispatch(localActionCreators.toggleMuteVideo()),
    toggleMuteMic: () => dispatch(localActionCreators.toggleMuteMic()),
    toggleMuteSpeaker: () => dispatch(localActionCreators.toggleMuteSpeaker())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ControlBoxContainer);
