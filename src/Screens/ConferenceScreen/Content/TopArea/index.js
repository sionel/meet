import { connect } from 'react-redux';
import TopAreaContainer from './TopAreaContainer';
import { actionCreators as localActionCreators } from '../../../../redux/modules/local';
import { actionCreators as mainUserActionCreators } from '../../../../redux/modules/mainUser';

const mapStateToProps = state => {
  const { local, documentShare } = state;

  return {
    conferenceMode: local.conferenceMode,
    isMuteVideo: local.user.isMuteVideo,
    documentListMode: documentShare.documentListMode,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleCameraFacingMode: () =>
      dispatch(localActionCreators.toggleCameraFacingMode()),
    toggleDocumentListMode: (documentListMode) =>
      dispatch(mainUserActionCreators.setDocumentListMode(documentListMode))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopAreaContainer);
