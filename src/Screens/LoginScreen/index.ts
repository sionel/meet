/**
 * LoginScreen index
 */

import { connect } from 'react-redux';
import LoginScreenContainer from './LoginScreenContainer';
import { actionCreators as UserActions } from '../../redux/modules/user';
import { actionCreators as AlertActions } from '../../redux/modules/alert';
import { actionCreators as RootActions } from '../../redux/modules/root';
import { Rootsstate } from '../../redux/modules/root';

// map state to props
const mapStateToProps = (state: any) => ({
  // auth: state.user.auth,
  // from: state.user.from,
  // permission: state.user.permission
});

// map dispatch to props
const mapDispatchToProps = (dispatch: any) => {
  return {
    setAlert: (params: any) => dispatch(AlertActions.setAlert(params)),
    setRootState: (rstate: Rootsstate) => dispatch(RootActions.setRootState(rstate))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginScreenContainer);
