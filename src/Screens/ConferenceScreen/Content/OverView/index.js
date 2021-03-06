import OverViewContainer from './OverViewContainer';
import { connect } from 'react-redux';
import { actionCreators as WedriveActions } from '../../../../redux/modules/wedrive';
import { actionCreators as mainUserActions } from '../../../../redux/modules/mainUser';
import { actionCreators as DocumentShareActions } from '../../../../redux/modules/documentShare';

// map state to props
const mapStateToProps = state => ({
  auth: state.user.auth,
  isLoading: state.wedrive.status,
  TokenID: state.wedrive.TokenID,
  wedriveList: state.wedrive.storageList,
  fileInfo: state.wedrive.fileInfo
});

// map dispatch to props
const mapDispatchToProps = dispatch => {
  return {
    setDocumentListMode: value => {
      return dispatch(DocumentShareActions.setDocumentListMode(value));
    },
    setSharingMode: value => {
      return dispatch(DocumentShareActions.setSharingMode(value));
    },
    initInfoRequest: authData =>
      dispatch(WedriveActions.initInfoRequest(authData)),
    getFileListRequest: (authData, initInfo) =>
      dispatch(WedriveActions.getFileListRequest(authData, initInfo)),
    getFileInfoRequest: (authData, fileInfo) =>
      dispatch(WedriveActions.getFileInfoRequest(authData, fileInfo)),
    cancelLoadDocument: requestName =>
      dispatch(WedriveActions.cancelLoadDocument(requestName))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OverViewContainer);
