/**
 * MainContainer
 * 최상위화면
 */

import { connect } from 'react-redux';
import { Rootsstate } from '../redux/modules/root';
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
  const setRootState = (rstate) => {
    dispatch(rootActions.setRootState(rstate));
  };
  return { setRootState };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);
