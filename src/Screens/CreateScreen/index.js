/**
 * CreateScreen
 */

import CreateScreenContainer from './CreateScreenContainer';
import { connect } from 'react-redux';
// actions
import { actionCreators as UserActions } from '../../redux/modules/user';
import { actionCreators as WetalkActions } from '../../redux/modules/wetalk';

/**
 * Connect - State to Props
 */
let mapStateToProps = state => ({
	auth: state.user.auth,
	wetalk: state.wetalk.list,
	didupdate: state.user.didupdate
});

/**
 * Connect - Dispatch to Props
 */
const mapDispatchToProps = dispatch => ({
	onLogin: user => dispatch(UserActions.login(user)),
	onSetWetalkList: list => dispatch(WetalkActions.setList(list))
});

/**
 * export
 */
export default connect(mapStateToProps, mapDispatchToProps)(CreateScreenContainer);
