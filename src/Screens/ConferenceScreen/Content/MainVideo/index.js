// stream={stream} isMuteVideo={mainUser.isMuteVideo} mainUser={mainUser}>

import { connect } from "react-redux";
import MainVideoContainer from "./MainVideoContainer";

const mapStateToProps = (state, ownProps) => {
  const {
    mainUser,
    mainUser: { isMuteVideo },
    mainUser: { videoTrack }
  } = ownProps;

  return {
    mainUser,
    stream: !isMuteVideo && videoTrack && videoTrack.getOriginalStream(),
    isMuteVideo,
    videoType: videoTrack && videoTrack.videoType
  };
};

export default connect(
  mapStateToProps,
  null
)(MainVideoContainer);
