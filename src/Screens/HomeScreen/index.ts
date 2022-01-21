/**
 * HomeScreen
 */

import HomeScreenContainer from './HomeScreenContainer';
export default HomeScreenContainer;

// import HomeScreenContainer from './HomeScreenContainer';
// import { connect } from 'react-redux';
// import { actionCreators as UserActions } from '@redux/user';
// import { actionCreators as WetalkActions } from '@redux/wetalk';
// import { actionCreators as ConferenceActions } from '@redux/conference';
// import { actionCreators as AlertAcions } from '@redux/alert';
// import { actionCreators as DeployedAcions } from '@redux/deployed';
// import { actionCreators as RootActions } from '@redux/root';

// const mapStateToProps = state => {
//   return {
//     auth: state.user.auth,
//     from: state.user.from,
//     permission: state.user.permission,
//     autoLogin: state.user.autoLogin,
//     conference: state.conference.list
//   };
// };

// /**
//  * Connect - Dispatch to Props
//  */
// const mapDispatchToProps = dispatch => ({
//   sessionCheck: session => dispatch(UserActions.sessionCheck(session)),
//   // onLogin: user => dispatch(UserActions.login(user)),
//   login: (auth, from, autoLogin) =>
//     dispatch(UserActions.login(auth, from, autoLogin)),
//   onLogout: () => dispatch(UserActions.logout()),
//   onDisconnect: () => dispatch(UserActions.disconnect()),
//   // loginCheckRequest: (AUTH_A_TOKEN, AUTH_R_TOKEN, cno, HASH_KEY, from) =>
//   //   dispatch(
//   //     UserActions.loginCheckRequest(
//   //       AUTH_A_TOKEN,
//   //       AUTH_R_TOKEN,
//   //       cno,
//   //       HASH_KEY,
//   //       from
//   //     )
//   //   ),
//   onSetWetalkList: list => dispatch(WetalkActions.setList(list)),
//   onSetConferenceList: list => dispatch(ConferenceActions.setList(list)),
//   setAlert: params => dispatch(AlertAcions.setAlert(params)),
//   setDeployedServices: params =>
//     dispatch(DeployedAcions.setDeployedServices(params)),
//   setDestination: destination =>
//     dispatch(RootActions.setDestination(destination)),
//   eventLog: event => dispatch(UserActions.eventLog(event)),
//   setVideoId: id => dispatch(RootActions.setVideoId(id))

//   // onCreateConference: bodyData => dispatch(ConferenceActions.createConference(...bodyData))
// });

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(HomeScreenContainer);
