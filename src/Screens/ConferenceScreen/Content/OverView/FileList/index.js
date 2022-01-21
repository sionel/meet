import FileListContainer from './FileListContainer';
import { connect } from 'react-redux';
import { actionCreators as WedriveActions } from '@redux/wedrive';
import { actionCreators as mainUserActions } from '@redux/mainUser';
import { actionCreators as DocumentShareActions } from '@redux/documentShare';
import { actionCreators as AlertActions } from '@redux/alert';

// map state to props
const mapStateToProps = state => ({
  auth: state.user.auth,
  TokenID: state.wedrive.TokenID,
  wedriveList: state.wedrive.storageList,
  fileInfo: state.wedrive.fileInfo
});

// map dispatch to props
const mapDispatchToProps = dispatch => {
  return {
    setDocumentListMode: value => {
      return dispatch(mainUserActions.setDocumentListMode(value));
    },
    // setSharingMode: value => {
    //   return dispatch(DocumentShareActions.setSharingMode(value));
    // },
    initInfoRequest: (authData, last_company) =>
      dispatch(WedriveActions.initInfoRequest(authData, last_company)),
    getFileListRequest: (authData, initInfo) =>
      dispatch(WedriveActions.getFileListRequest(authData, initInfo)),
    getFileInfoRequest: (authData, fileInfo) =>
      dispatch(WedriveActions.getFileInfoRequest(authData, fileInfo)),
    getDirectoryInfoRequest: (authData, directory) =>
      dispatch(WedriveActions.getDirectoryInfoRequest(authData, directory)),
    setAlert: params => dispatch(AlertActions.setAlert(params))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FileListContainer);
