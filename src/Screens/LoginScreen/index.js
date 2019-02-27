/**
 * LoginScreen index
 */

import { connect } from 'react-redux';
import LoginScreenContainer from './LoginScreenContainer';
import { actionCreators as UserActions } from '../../redux/modules/user';
// export default LoginScreenContainer;

const mapStateToProps = null;

const mapDispatchToProps = dispatch => {
	return {
		onTokenLogin: (token, cno) => dispatch(UserActions.tokenLogin(token, cno))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreenContainer);
