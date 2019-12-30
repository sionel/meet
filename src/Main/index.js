/**
 * MainContainer
 * 최상위화면
 */

import { connect } from 'react-redux';
import MainContainer from './MainContainer';
import { actionCreators as UserActions } from '../redux/modules/user';
import { actionCreators as DocumentShareActions } from '../redux/modules/documentShare';
import { actionCreators as WedriveAcionCreators } from '../redux/modules/wedrive';

// map state to props
const mapStateToProps = state => ({
  auth: state.user.auth,
  isLogin: state.user.isLogin
});

// map dispatch to props
const mapDispatchToProps = dispatch => {
  return {
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
    setSharingMode: () => dispatch(DocumentShareActions.setSharingMode()),
    setInitInfo: () => dispatch(WedriveAcionCreators.setInitInfo())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);
