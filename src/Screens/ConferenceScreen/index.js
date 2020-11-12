import { connect } from 'react-redux';
import ConferenceScreenContainer from './ConferenceScreenContainer';
import { actionCreators as DocumentShareActions } from '../../redux/modules/documentShare';
import { actionCreators as localActions } from '../../redux/modules/local';

const getMainUser = (mainUserId, localUser, participants) => {
  if (!localUser) {
    return null;
  } else if (mainUserId === localUser.id) {
    return localUser;
  } else {
    return participants.find(participant => participant.id === mainUserId);
  }
};

const mapStateToProps = state => {
  const {
    local: { user, createdTime, isMasterControl },
    mainUser: { mainUserId },
    participants: { list },
    user: { auth },
    documentShare
  } = state;
  const mainUser = getMainUser(mainUserId, user, list);
  return {
    mainUser,
    mainUserId,
    user_name: auth.user_name,
    createdTime,
    auth: auth,
    documentShare,
    list,
    user,
    from: state.user?.from,
    isMasterControl,
    isMuteMic: user?.isMuteMic
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch: dispatch,
    setSharingMode: () => dispatch(DocumentShareActions.setSharingMode()),
    toggleMuteVideo: muteState =>
      dispatch(localActions.toggleMuteVideo(muteState)),
    toggleMuteMic: muteState => dispatch(localActions.toggleMuteMic(muteState)),
    changeMasterControlMode: flag =>
      dispatch(localActions.changeMasterControlMode(flag)),
    toggleMuteMicByMe: () => dispatch(localActions.toggleMuteMicByMe())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConferenceScreenContainer);
