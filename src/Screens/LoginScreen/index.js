/**
 * LoginScreen index
 */

import { connect } from 'react-redux';
import LoginScreenContainer from './LoginScreenContainer';
import { actionCreators as UserActions } from '../../redux/modules/user';

// map state to props
const mapStateToProps = state => ({
  user: state.user.auth,
  permission: state.user.permission
});

// map dispatch to props
const mapDispatchToProps = dispatch => {
  return {
    onTokenLogin: (token, cno) => dispatch(UserActions.tokenLogin(token, cno)),
    onLogin: user => dispatch(UserActions.login(user)),
    onAgreement: () => dispatch(UserActions.agreement())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginScreenContainer);
