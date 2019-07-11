/**
 * FileSharing index
 */

import { connect } from 'react-redux';
import FileSharingContainer from './FileSharingContainer';
import { actionCreators as DocumentShareActions } from '../../../../redux/modules/documentShare';

// map state to props
const mapStateToProps = state => ({
  attributes: state.documentShare.attributes,
  presenter: state.documentShare.presenter,
  page: state.documentShare.page,
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
