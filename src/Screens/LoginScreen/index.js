/**
 * LoginScreen index
 */

import { connect } from 'react-redux';
import LoginScreenContainer from './LoginScreenContainer';
import { actionCreators as UserActions } from '../../redux/modules/user';

// map state to props
const mapStateToProps = state => ({
  auth: state.user.auth,
  isWehagoLogin: state.user.isWehagoLogin,
  permission: state.user.permission
});

// map dispatch to props
const mapDispatchToProps = dispatch => {
  return {
    // onTokenLogin: (token, cno) => dispatch(UserActions.tokenLogin(token, cno)),
    loginRequest: data => dispatch(UserActions.loginRequest(data)),
    loginCheckRequest: (
      AUTH_A_TOKEN,
      AUTH_R_TOKEN,
      cno,
      HASH_KEY,
      isWehagoLogin
    ) =>
      dispatch(
        UserActions.loginCheckRequest(
          AUTH_A_TOKEN,
          AUTH_R_TOKEN,
          cno,
          HASH_KEY,
          isWehagoLogin
        )
      ),
    onAgreement: () => dispatch(UserActions.agreement()),
    onLogout: () => dispatch(UserActions.logout())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginScreenContainer);
