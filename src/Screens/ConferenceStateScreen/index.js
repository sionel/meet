import ConferenceStateContainer from './ConferenceStateContainer';
import { connect } from 'react-redux';
import { actionCreators as UserActions } from '../../redux/modules/user';
import { actionCreators as WetalkActions } from '../../redux/modules/wetalk';

const mapStateToProps = state => ({
  auth: state.user.auth,

});

const mapDispatchTopProps = dispatch => ({
});

export default connect(
  mapStateToProps,
  mapDispatchTopProps
)(ConferenceStateContainer);
