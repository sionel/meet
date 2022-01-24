import { connect } from 'react-redux';
import ControlBoxContainer from './ControlBoxContainer';
import { actionCreators as localActionCreators } from '@redux/local';
import { actionCreators as masterActionCreators } from '@redux/master';
import { actionCreators as toastActionCreators } from '@redux/toast';

const mapStateToProps = state => {
  const { local, master, screenShare } = state;
  return {
    isMuteVideo: local.user.isMuteVideo,
    isMuteMic: local.user.isMuteMic,
    isMuteSpeaker: local.user.isMuteSpeaker,
    isAudioActive: master.isAudioActive, // 마이크 활성화
    name: local.user.name,
    isMicRequest: master.isMicRequest,
    isMasterControl: master.isMasterControl,
    isScreenShare: screenShare.isScreenShare
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleMuteVideo: () => dispatch(localActionCreators.toggleMuteVideo()),
    toggleMuteMic: () => dispatch(localActionCreators.toggleMuteMic()),
    // toggleMuteMicByMe: () => dispatch(masterActionCreators.toggleMuteMicByMe()),
    // toggleMuteSpeaker: () => dispatch(localActionCreators.toggleMuteSpeaker()),
    setToastMessage: msg => dispatch(toastActionCreators.setToastMessage(msg)),
    setMicRequest: flag => dispatch(masterActionCreators.setMicRequest(flag))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ControlBoxContainer);
