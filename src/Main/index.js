/**
 * MainContainer
 * 최상위화면
 */

import { connect } from 'react-redux';
import MainContainer from './MainContainer';

import { actionCreators as rootActions } from '../redux/modules/root';
// map state to props
const mapStateToProps = (state) => {
  const { from } = state.user;
  const { loaded } = state.root;
  
  return {
    from,
    loaded
    // params,
  };
};

// map dispatch to props
const mapDispatchToProps = (dispatch) => {
  const setRootState = (rootstate) => {
    dispatch(rootActions.setRootState(rootstate));
  };
  return { setRootState };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);
