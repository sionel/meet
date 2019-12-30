/**
 * HomeScreen
 */

import HomeScreenContainer from './HomeScreenContainer';
import { connect } from 'react-redux';
import { actionCreators as UserActions } from '../../redux/modules/user';
import { actionCreators as WetalkActions } from '../../redux/modules/wetalk';

const mapStateToProps = state => ({
  auth: state.user.auth,
  isWehagoLogin: state.user.isWehagoLogin,
  wetalk: state.wetalk.list
});

/**
 * Connect - Dispatch to Props
 */
const mapDispatchToProps = dispatch => ({
  onLogin: user => dispatch(UserActions.login(user)),
  onLogout: () => dispatch(UserActions.logout()),
  onDisconnect: () => dispatch(UserActions.disconnect()),
  loginCheckRequest: (AUTH_A_TOKEN, AUTH_R_TOKEN, cno, HASH_KEY, isWehagoLogin) =>
    dispatch(
      UserActions.loginCheckRequest(
        AUTH_A_TOKEN,
        AUTH_R_TOKEN,
        cno,
        HASH_KEY,
        isWehagoLogin
      )
    ),
  onSetWetalkList: list => dispatch(WetalkActions.setList(list))
  // onCreateConference: bodyData => dispatch(ConferenceActions.createConference(...bodyData))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreenContainer);
