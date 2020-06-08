import { connect } from 'react-redux';
import TopAreaContainer from './TopAreaContainer';
import { actionCreators as localActionCreators } from '../../../../redux/modules/local';
import { actionCreators as mainUserActionCreators } from '../../../../redux/modules/mainUser';

const mapStateToProps = state => {
  const { local, mainUser, user } = state;

  return {
    conferenceMode: local.conferenceMode,
    isMuteVideo: local.user.isMuteVideo,
    documentListMode: mainUser.documentListMode,
    memberType: user.auth.member_type // wehago one 사용자
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleCameraFacingMode: () =>
      dispatch(localActionCreators.toggleCameraFacingMode()),
    toggleDocumentListMode: documentListMode =>
      dispatch(mainUserActionCreators.setDocumentListMode(documentListMode))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TopAreaContainer);
