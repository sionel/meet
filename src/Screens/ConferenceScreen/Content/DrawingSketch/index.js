/**
 * Drawing INDEX
 */

import DrawingContainer from './DrawingContainer';
import { connect } from 'react-redux';
import { actionCreators as DocumentShareActions } from '../../../../redux/modules/documentShare';

// map state to props
const mapStateToProps = state => ({
  page: state.documentShare.page
});

export default connect(
  mapStateToProps,
  null
)(DrawingContainer);
