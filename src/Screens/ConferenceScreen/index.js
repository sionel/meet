import { connect } from 'react-redux';
import ConferenceScreenContainer from './ConferenceScreenContainer';
import { actionCreators as DocumentShareActions } from '../../redux/modules/documentShare';
import { actionCreators as LocalActions } from '../../redux/modules/local';
import { actionCreators as MasterActions } from '../../redux/modules/master';
import { actionCreators as AlertAcions } from '../../redux/modules/alert';
import { actionCreators as MainUserAcions } from '../../redux/modules/mainUser';
import { actionCreators as ToastAcions } from '../../redux/modules/toast';
import { actionCreators as ScreenShareAcions } from '../../redux/modules/ScreenShare';
import { actionCreators as ParticipantsAcions } from '../../redux/modules/participants';
import _ from 'underscore';

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
    local: {
      user,
      createdTime,
      isMasterControl,
      isMasterMicControl,
      externalAPIScope
    },
    mainUser: { mainUserId },
    participants: { list },
    user: { auth },
    documentShare,
    screenShare: { isScreenShare, screenToggleFlag }
  } = state;

  const mainUser = getMainUser(mainUserId, user, list);
  // console.log('asdasd');
  // if (mainUserId) {
  //   console.log('mainUserId');
  //   console.log(mainUserId);
  // }
  // console.log('---');
  // if (user) {
  //   console.log('user');
  //   console.log(user);
  // }
  // console.log('---');
  // if (list) {
  //   console.log('list');
  //   console.log(list);
  // }
  // console.log('===');
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
    isMasterMicControl,
    isMuteMic: user?.isMuteMic,
    externalAPIScope,
    isScreenShare,
    screenToggleFlag
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch: dispatch,
    setSharingMode: () => dispatch(DocumentShareActions.setSharingMode()),
    toggleMuteVideo: muteState =>
      dispatch(LocalActions.toggleMuteVideo(muteState)),
    toggleMuteMic: muteState => dispatch(LocalActions.toggleMuteMic(muteState)),
    changeAudioActive: flag => dispatch(MasterActions.changeAudioActive(flag)),
    changeMasterControlMode: flag =>
      dispatch(MasterActions.changeMasterControlMode(flag)),
    toggleMuteMicByMe: () => dispatch(MasterActions.toggleMuteMicByMe()),
    setAlert: params => dispatch(AlertAcions.setAlert(params)),
    joinConference: params => dispatch(LocalActions.joinConference(params)),
    setTrack: track => dispatch(LocalActions.setTrack(track)),
    setMainUserNotExist: id => dispatch(MainUserAcions.setMainUserNotExist()),
    initMainUser: () => dispatch(MainUserAcions.initMainUser()),
    // changeMasterControlMode: id =>
    //   dispatch(MasterActions.changeMasterControlMode(id)),
    setToastMessage: msg => dispatch(ToastAcions.setToastMessage(msg)),
    toggleScreenFlag: () => dispatch(ScreenShareAcions.toggleScreenFlag()),
    setScreenFlag: flag => dispatch(ScreenShareAcions.setScreenFlag(flag)),
    initParticipants: () => dispatch(ParticipantsAcions.initParticipants())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConferenceScreenContainer);
