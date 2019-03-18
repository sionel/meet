import ConfigurationScreenContainer from './ConfigurationScreenContainer';
import { connect } from 'react-redux';
import { actionCreators as UserActions } from '../../redux/modules/user';

const mapStateToProps = state => ({
	user: state.user.auth
});

const mapDispatchTopProps = dispatch => ({
	onLogout: () => dispatch(UserActions.logout()),
	onDestroyToken: () => dispatch(UserActions.token()),
	onToggleVisibleAppIntro: () => dispatch(UserActions.toggleVisibleAppIntro())
});

export default connect(mapStateToProps, mapDispatchTopProps)(ConfigurationScreenContainer);
