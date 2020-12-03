import { connect } from 'react-redux';
import ControlBoxContainer from './ControlBoxContainer';
import { actionCreators as localActionCreators } from '../../../../../redux/modules/local';

const mapStateToProps = state => {
  const { local } = state;
  return {
    isMuteVideo: local.user.isMuteVideo,
    isMuteMic: local.user.isMuteMic,
    isMuteSpeaker: local.user.isMuteSpeaker,
    isAudioActive: local.isAudioActive, // 마이크 활성화
    name: local.user.name,
    isMicRequest :local.isMicRequest,
    isMasterControl: local.isMasterControl
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleMuteVideo: () => dispatch(localActionCreators.toggleMuteVideo()),
    toggleMuteMic: () => dispatch(localActionCreators.toggleMuteMic()),
    toggleMuteMicByMe: () => dispatch(localActionCreators.toggleMuteMicByMe()),
    toggleMuteSpeaker: () => dispatch(localActionCreators.toggleMuteSpeaker()),
    setSimpleNoti: msg => dispatch(localActionCreators.setToastMessage(msg)),
    setMicRequest: flag => dispatch(localActionCreators.setMicRequest(flag))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ControlBoxContainer);
