import ConfigurationScreenContainer from './ConfigurationScreenContainer';
import { connect } from 'react-redux';
import { actionCreators as UserActions } from '../../redux/modules/user';
import { actionCreators as WetalkActions } from '../../redux/modules/wetalk';

const mapStateToProps = state => ({
  user: state.user.auth
  // log: state.user.log
});

const mapDispatchTopProps = dispatch => ({
  onLogout: () => dispatch(UserActions.logout()),
  onSetInitialList: () => dispatch(WetalkActions.setInitialList()),
  onDestroyToken: () => dispatch(UserActions.token()),
  onToggleVisibleAppIntro: () => dispatch(UserActions.toggleVisibleAppIntro())
});

export default connect(
  mapStateToProps,
  mapDispatchTopProps
)(ConfigurationScreenContainer);
