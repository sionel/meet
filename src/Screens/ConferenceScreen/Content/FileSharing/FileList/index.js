import FileListContainer from './FileListContainer';
import { connect } from 'react-redux';
import { actionCreators as mainUserActions } from '../../../../../redux/modules/mainUser';
import { actionCreators as WedriveActions } from '../../../../../redux/modules/wedrive';

// map state to props
const mapStateToProps = state => ({
  auth: state.user.auth,
  wedrive: state.wedrive.storageList,
});

// map dispatch to props
const mapDispatchToProps = dispatch => {
  return {
    setDocumentListMode: value => {
      return dispatch(mainUserActions.setDocumentListMode(value));
    },
    setSharingMode: value => {
      return dispatch(mainUserActions.setSharingMode(value));
    },
    initInfoRequest: authData =>
      dispatch(WedriveActions.initInfoRequest(authData)),
    getFileListRequest: (authData, initInfo) =>
      dispatch(WedriveActions.getFileListRequest(authData, initInfo)),
    getFileInfoRequest: (authData, fileInfo) =>
      dispatch(WedriveActions.getFileInfoRequest(authData, fileInfo)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileListContainer);
