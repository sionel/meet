/**
 * LoadingScreen index
 */

import { connect } from 'react-redux';
import LoadingScreenContainer from './LoadingScreenContainer';
import { actionCreators as UserActions } from '../../redux/modules/user';

const mapStateToProps = null;

const mapDispatchToProps = dispatch => {
	return {
		onTokenLogin: (token, cno) => dispatch(UserActions.tokenLogin(token, cno))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(LoadingScreenContainer);
