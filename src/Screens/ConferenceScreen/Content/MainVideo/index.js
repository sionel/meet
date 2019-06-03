// stream={stream} isMuteVideo={mainUser.isMuteVideo} mainUser={mainUser}>

import { connect } from "react-redux";
import MainVideoContainer from "./MainVideoContainer";
// import { actionCreators as localActions } from '../../../../redux/modules/local';

const mapStateToProps = (state, ownProps) => {
	const { local: { createdTime } } = state;
  const {
    mainUser,
    mainUser: { isMuteVideo },
    mainUser: { videoTrack }
  } = ownProps;

  return {
    mainUser,
    stream: !isMuteVideo && videoTrack && videoTrack.getOriginalStream(),
    isMuteVideo,
    videoType: videoTrack && videoTrack.videoType,
    createdTime,
  };
};

export default connect(
  mapStateToProps,
  null
)(MainVideoContainer);
