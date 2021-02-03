/**
 * MainContainer
 * 최상위화면
 */

import { connect } from 'react-redux';
import MainContainer from './MainContainer';
// map state to props
const mapStateToProps = state => ({
  from: state.user.from
});

// map dispatch to props
const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);
