/**
 * MainContainer
 * 최상위화면 
 */

import { connect } from "react-redux";
import MainContainer from "./MainContainer";
// import { actionCreators as UserActions } from '../redux/modules/user';

// map state to props
const mapStateToProps = state => ({
  auth: state.user.auth,
});

// map dispatch to props
// const mapDispatchToProps = dispatch => {
//   return {
// 		loginCheckRequest: (AUTH_A_TOKEN, AUTH_R_TOKEN, cno, HASH_KEY) => 
// 			dispatch(UserActions.loginCheckRequest(
// 				AUTH_A_TOKEN, AUTH_R_TOKEN, cno, HASH_KEY
// 			))
//   };
// };

export default connect(mapStateToProps)(MainContainer);
