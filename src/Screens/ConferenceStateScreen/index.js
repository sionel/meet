import ConferenceStateContainer from './ConferenceStateContainer';
import { connect } from 'react-redux';
import { actionCreators as UserActions } from '../../redux/modules/user';
import { actionCreators as WetalkActions } from '../../redux/modules/wetalk';

const mapStateToProps = state => ({
  auth: state.user.auth,
  from: state.user.from,
  params: state.root.params,
  videoId: state.root.videoId,

});

const mapDispatchTopProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchTopProps
)(ConferenceStateContainer);
