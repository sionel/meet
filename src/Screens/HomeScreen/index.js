/**
 * HomeScreen
 */

import HomeScreenContainer from './HomeScreenContainer';
import { connect } from 'react-redux';
import { actionCreators as UserActions } from '../../redux/modules/user';
import { actionCreators as WetalkActions } from '../../redux/modules/wetalk';
import { actionCreators as ConferenceActions } from '../../redux/modules/conference';

const mapStateToProps = state => ({
  auth: state.user.auth,
  from: state.user.from,
  permission: state.user.permission,
  conference: state.conference.list,
});

/**
 * Connect - Dispatch to Props
 */
const mapDispatchToProps = dispatch => ({
  sessionCheck: session => dispatch(UserActions.sessionCheck(session)),
  onLogin: user => dispatch(UserActions.login(user)),
  onLogout: () => dispatch(UserActions.logout()),
  onDisconnect: () => dispatch(UserActions.disconnect()),
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
  onSetWetalkList: list => dispatch(WetalkActions.setList(list)),
  onSetConferenceList : list => dispatch(ConferenceActions.setList(list)),

  // onCreateConference: bodyData => dispatch(ConferenceActions.createConference(...bodyData))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreenContainer);
