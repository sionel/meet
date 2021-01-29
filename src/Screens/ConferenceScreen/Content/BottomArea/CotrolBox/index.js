import { connect } from 'react-redux';
import ControlBoxContainer from './ControlBoxContainer';
import { actionCreators as localActionCreators } from '../../../../../redux/modules/local';
import { actionCreators as masterActionCreators } from '../../../../../redux/modules/master';

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
    toggleMuteMicByMe: () => dispatch(masterActionCreators.toggleMuteMicByMe()),
    toggleMuteSpeaker: () => dispatch(localActionCreators.toggleMuteSpeaker()),
    setSimpleNoti: msg => dispatch(masterActionCreators.setToastMessage(msg)),
    setMicRequest: flag => dispatch(masterActionCreators.setMicRequest(flag))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ControlBoxContainer);
