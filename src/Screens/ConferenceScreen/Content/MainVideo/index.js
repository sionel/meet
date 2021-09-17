// stream={stream} isMuteVideo={mainUser.isMuteVideo} mainUser={mainUser}>

import { connect } from 'react-redux';
import MainVideoContainer from './MainVideoContainer';
// import { actionCreators as localActions } from '../../../../redux/modules/local';
import { actionCreators as ScreenShareCreators } from '../../../../redux/modules/ScreenShare';

const mapStateToProps = (state, ownProps) => {
  const {
    local: { createdTime },
    screenShare: { isScreenShare }
  } = state;
  const {
    mainUser,
    mainUser: { isMuteVideo },
    mainUser: { videoTrack }
  } = ownProps;
  if (!mainUser) debugger;
  return {
    mainUser,
    stream: !isMuteVideo && videoTrack && videoTrack.getOriginalStream(),
    isMuteVideo,
    videoType: videoTrack && videoTrack.videoType,
    createdTime,
    isScreenShare
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setScreenFlag: flag => dispatch(ScreenShareCreators.setScreenFlag(flag)),
    toggleScreenFlag: () => dispatch(ScreenShareCreators.toggleScreenFlag())
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(MainVideoContainer);
