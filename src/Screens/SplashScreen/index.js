/**
 * SplashScreen index
 * 1. 업데이트 체크
 * 2. 노티 확인
 * 3. 로그인 확인
 * 4. 딥링크 확인
 */

import { connect } from 'react-redux';
import SplashScreenContainer from './SplashScreenContainer';
import { actionCreators as UserActions } from '../../redux/modules/user';
import { actionCreators as DocumentShareActions } from '../../redux/modules/documentShare';
import { actionCreators as WedriveAcions } from '../../redux/modules/wedrive';
import { actionCreators as AlertAcions } from '../../redux/modules/alert';

// map state to props
const mapStateToProps = state => {
  return {
    auth: state.user.auth,
    from: state.user.from,
    permission: state.user.permission,
    updateNoti: state.user.updateNoti
  };
};

// map dispatch to props
const mapDispatchToProps = dispatch => {
  return {
    loginRequest: (data, access_pass) =>
      dispatch(UserActions.loginRequest(data, access_pass)),
    loginCheckRequest: (AUTH_A_TOKEN, AUTH_R_TOKEN, cno, HASH_KEY, from) =>
      dispatch(
        UserActions.loginCheckRequest(
          AUTH_A_TOKEN,
          AUTH_R_TOKEN,
          cno,
          HASH_KEY,
          from
        )
      ),
    onAgreement: () => dispatch(UserActions.agreement()),
    onLogout: () => dispatch(UserActions.logout()),
    setPermission: permission =>
      dispatch(UserActions.setPermission(permission)),
    setSharingMode: () => dispatch(DocumentShareActions.setSharingMode()),
    setInitInfo: () => dispatch(WedriveAcions.setInitInfo()),
    toggleUpdateNoti: () => dispatch(UserActions.toggleUpdateNoti()),
    setAlert: params => dispatch(AlertAcions.setAlert(params))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SplashScreenContainer);
