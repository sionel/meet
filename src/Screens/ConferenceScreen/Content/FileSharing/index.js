/**
 * FileSharing index
 */

import { connect } from 'react-redux';
import FileSharingContainer from './FileSharingContainer';
import { actionCreators as WedriveActions } from '../../../../redux/modules/wedrive';

// map state to props
const mapStateToProps = state => ({
  auth: state.user.auth,
  wedrive: state.wedrive
});

// map dispatch to props
const mapDispatchToProps = dispatch => {
  return {
    initInfoRequest: authData =>
      dispatch(WedriveActions.initInfoRequest(authData)),
    getFileListRequest: (authData, initInfo) =>
      dispatch(WedriveActions.getFileListRequest(authData, initInfo)),
    getFileInfoRequest: (authData, fileInfo) =>
      dispatch(WedriveActions.getFileInfoRequest(authData, fileInfo))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileSharingContainer);
