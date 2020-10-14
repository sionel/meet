/**
 * SplashScreen index
 * 1. 업데이트 체크
 * 2. 노티 확인
 */

import { connect } from 'react-redux';
import SplashScreenContainer from './SplashScreenContainer';
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
    loginRequest: (data, access_pass) =>
      dispatch(UserActions.loginRequest(data, access_pass)),
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
)(SplashScreenContainer);
