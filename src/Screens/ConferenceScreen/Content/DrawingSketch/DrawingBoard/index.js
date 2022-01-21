/**
 *
 */

import DrawingBoard from './DrawingBoard';
import { connect } from 'react-redux';
import { actionCreators as DocumentShareActions } from '@redux/documentShare';

// map state to props
const mapStateToProps = state => ({
  documentData: state.documentShare.documentData,
  page: state.documentShare.page,
  presenter: state.documentShare.presenter,
});

// map dispatch to props
const mapDispatchToProps = dispatch => {
  return {
    setDrawData: value => {
      return dispatch(DocumentShareActions.setDrawData(value));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DrawingBoard);
