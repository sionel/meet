/**
 * LoginScreen index
 */

import { connect } from 'react-redux';
import LoginScreenContainer from './LoginScreenContainer';
import { actionCreators as UserActions } from '../../redux/modules/user';
import { actionCreators as AlertActions } from '../../redux/modules/alert';

// map state to props
const mapStateToProps = state => ({
  // auth: state.user.auth,
  // from: state.user.from,
  // permission: state.user.permission
});

// map dispatch to props
const mapDispatchToProps = dispatch => {
  return {
    setAlert: params => dispatch(AlertActions.setAlert(params))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginScreenContainer);
