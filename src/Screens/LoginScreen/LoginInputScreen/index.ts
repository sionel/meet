import LoginInputContainer from './LoginInputContainer';
export default LoginInputContainer;

// map state to props
// const mapStateToProps = (state: any)=> ({
//   auth: state.user.auth
//   from: state.user.from,
//   permission: state.user.permission
// });

// // map dispatch to props
// const mapDispatchToProps = (dispatch: any) => {
//   return {
//     onTokenLogin: (token, cno) => dispatch(UserActions.tokenLogin(token, cno)),
//     loginRequest: (data, access_pass) =>
//     dispatch(UserActions.loginRequest(data, access_pass)),
//     loginCheckRequest: (AUTH_A_TOKEN: any, AUTH_R_TOKEN: any, cno: any, HASH_KEY: any, from: any) =>
//       dispatch(
//         UserActions.loginCheckRequest(
//           AUTH_A_TOKEN,
//           AUTH_R_TOKEN,
//           cno,
//           HASH_KEY,
//           from
//         )
//       ),
//     setPermission: (permission:any) => dispatch(UserActions.setPermission(permission)),
//     onAgreement: () => dispatch(UserActions.agreement()),
//     onLogout: () => dispatch(UserActions.logout())
//     settRootState: (rstate:Rootsstate) => dispatch(RootActions.setRootState(rstat//     set//   };
// };



