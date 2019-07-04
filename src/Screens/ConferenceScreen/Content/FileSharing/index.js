/**
 * FileSharing index
 */

import { connect } from 'react-redux';
import FileSharingContainer from './FileSharingContainer';
import { actionCreators as WedriveActions } from '../../../../redux/modules/wedrive';

// map state to props
const mapStateToProps = state => ({
  attributes: state.documentShare.attributes,
  presenter: state.documentShare.presenter,
});

// map dispatch to props
// const mapDispatchToProps = dispatch => {
//   return {
//     initInfoRequest: authData =>
//       dispatch(WedriveActions.initInfoRequest(authData)),
//     getFileListRequest: (authData, initInfo) =>
//       dispatch(WedriveActions.getFileListRequest(authData, initInfo)),
//     getFileInfoRequest: (authData, fileInfo) =>
//       dispatch(WedriveActions.getFileInfoRequest(authData, fileInfo))
//   };
// };

export default connect(
  mapStateToProps,
  null
)(FileSharingContainer);
