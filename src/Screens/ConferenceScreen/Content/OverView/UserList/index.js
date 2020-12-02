import UserListContainer from './UserListContainer';
import { connect } from 'react-redux';
import { actionCreators as localActionCreators } from '../../../../../redux/modules/local';
import { actionCreators as participantsActionCreators } from '../../../../../redux/modules/participants';

// map state to props
const mapStateToProps = state => {
  return {
    auth: state.user.auth,
    user: state.local.user,
    users: state.participants.list,
    attributes: state.documentShare.attributes,
    presenter: state.documentShare.presenter,
    masters: state.master.masterList
  };
};

const mapDispatchToProps = dispatch => {
  return {
    // toggleMuteVideo: () => dispatch(localActionCreators.toggleMuteVideo()),
    toggleMuteMic: () => dispatch(localActionCreators.toggleMuteMic()),
    toggleMuteSpeaker: () => dispatch(localActionCreators.toggleMuteSpeaker())
    // updateMuteAudio: user => dispatch(participantsActionCreators.updateMuteAudio(user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserListContainer);
