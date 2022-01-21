import ConfigurationScreenContainer from './ConfigurationScreenContainer';
export default ConfigurationScreenContainer;

// import ConfigurationScreenContainer from './ConfigurationScreenContainer';
// import { connect } from 'react-redux';
// import { actionCreators as UserActions } from '@redux/user';
// import { actionCreators as WetalkActions } from '@redux/wetalk';
// import { actionCreators as RootActions } from '@redux/root';
// import { actionCreators as DeployedAcions } from '@redux/deployed';
// import { actionCreators as RecentsActions} from '@redux/recentsInvited';

// const mapStateToProps = state => ({
//   user: state.user.auth,
//   from: state.user.from
//   // log: state.user.log
// });

// const mapDispatchTopProps = dispatch => ({
//   onLogout: () => {
//     dispatch(UserActions.logout());
//     dispatch(RecentsActions.resetRecents());
//   },
//   onSetInitialList: () => {
//     dispatch(WetalkActions.setInitialList());
//   },
//   onDestroyToken: () => dispatch(UserActions.token()),
//   onToggleVisibleAppIntro: () => dispatch(UserActions.toggleVisibleAppIntro()),
//   setDestination: destination =>
//     dispatch(RootActions.setDestination(destination)),
//   resetDeployedServices: () => dispatch(DeployedAcions.resetDeployedServices())
// });

// export default connect(
//   mapStateToProps,
//   mapDispatchTopProps
// )(ConfigurationScreenContainer);
