/**
 * FileSharing index
 */

import { connect } from 'react-redux';
import FileSharingContainer from './FileSharingContainer';
// import { actionCreators as mainUserActions } from '@redux/mainUser';
import { actionCreators as DocumentShareActions } from '@redux/documentShare';

// map state to props
const mapStateToProps = state => ({
  attributes: state.documentShare.attributes,
  presenter: state.documentShare.presenter,
  page: state.documentShare.page,
  documentListMode: state.documentShare.documentListMode,
  mode: state.documentShare.mode,
  isMuteMic: state.local.user.isMuteMic
});

// map dispatch to props
const mapDispatchToProps = dispatch => {
  return {
    setDocumentListMode: value => {
      return dispatch(DocumentShareActions.setDocumentListMode(value));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileSharingContainer);
