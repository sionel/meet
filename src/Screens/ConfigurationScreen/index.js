import ConfigurationScreenContainer from './ConfigurationScreenContainer';
import { connect } from 'react-redux';
import { actionCreators as UserActions } from '../../redux/modules/user';
import { actionCreators as WetalkActions } from '../../redux/modules/wetalk';
import { actionCreators as ConferenceActions } from '../../redux/modules/conference';
import { actionCreators as RootActions} from '../../redux/modules/root';
import { actionCreators as RecentsActions} from '../../redux/modules/recentsInvited';

const mapStateToProps = state => ({
  user: state.user.auth,
  from: state.user.from
  // log: state.user.log
});

const mapDispatchTopProps = dispatch => ({
  onLogout: () => dispatch(UserActions.logout()),
  onSetInitialList: () => {
    dispatch(WetalkActions.setInitialList());
    dispatch(ConferenceActions.setInitialList());
  },
  onDestroyToken: () => dispatch(UserActions.token()),
  onToggleVisibleAppIntro: () => dispatch(UserActions.toggleVisibleAppIntro()),
  setDestination: (destination) => dispatch(RootActions.setDestination(destination)),
  resetRecents: () => dispatch(RecentsActions.resetRecents()),
});

export default connect(
  mapStateToProps,
  mapDispatchTopProps
)(ConfigurationScreenContainer);
