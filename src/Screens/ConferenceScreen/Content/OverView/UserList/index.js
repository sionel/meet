import UserListContainer from './UserListContainer';
import { connect } from 'react-redux';
import { actionCreators as localActionCreators } from '../../../../../redux/modules/local';

// map state to props
const mapStateToProps = state => ({
  auth: state.user.auth,
  user: state.local.user,
  users: state.participants.list,
  attributes: state.documentShare.attributes,
  presenter: state.documentShare.presenter,
});

const mapDispatchToProps = dispatch => {
  return {
    // toggleMuteVideo: () => dispatch(localActionCreators.toggleMuteVideo()),
    toggleMuteMic: () => dispatch(localActionCreators.toggleMuteMic()),
    toggleMuteSpeaker: () => dispatch(localActionCreators.toggleMuteSpeaker())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserListContainer);
