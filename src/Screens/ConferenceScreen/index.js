import { connect } from 'react-redux';
import ConferenceScreenContainer from './ConferenceScreenContainer';
import { actionCreators as DocumentShareActions } from '@redux/documentShare';
import { actionCreators as LocalActions } from '@redux/local';
import { actionCreators as MasterActions } from '@redux/master';
import { actionCreators as AlertAcions } from '@redux/alert';
import { actionCreators as MainUserAcions } from '@redux/mainUser';
import { actionCreators as ToastAcions } from '@redux/toast';
import { actionCreators as ScreenShareAcions } from '@redux/ScreenShare';
import { actionCreators as ParticipantsAcions } from '@redux/participants';
import { actionCreators as indicatorAcionCreators } from '@redux/indicator';
import { actionCreators as RootActions } from '@redux/root';
import { actionCreators as ConferenceActions } from '@redux/conference';

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
    user: { auth,isLogin},
    documentShare,
    screenShare: { isScreenShare, screenToggleFlag },
    root: { destination,url },
    conference: {isConference}
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
    isMasterMicControl,
    isMuteMic: user?.isMuteMic,
    externalAPIScope,
    isScreenShare,
    screenToggleFlag,
    destination,
    isLogin,
    url,
    isConference
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch: dispatch,
    setSharingMode: () => {
      return dispatch(DocumentShareActions.setSharingMode());
    },
    toggleMuteVideo: muteState =>
      dispatch(LocalActions.toggleMuteVideo(muteState)),
    toggleMuteMic: muteState => dispatch(LocalActions.toggleMuteMic(muteState)),
    changeAudioActive: flag => dispatch(MasterActions.changeAudioActive(flag)),
    changeMasterControlMode: flag =>
      dispatch(MasterActions.changeMasterControlMode(flag)),
    // toggleMuteMicByMe: (muteState) => dispatch(MasterActions.toggleMuteMicByMe(muteState)),
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
    initParticipants: () => dispatch(ParticipantsAcions.initParticipants()),
    setIndicator: () =>
      dispatch(indicatorAcionCreators.setIndicator('화상회의 종료 중')),
    resetVideoId: () => dispatch(RootActions.setVideoId('')),
    setIsConference: flag => dispatch(ConferenceActions.setIsConference(flag)),
    setConferenceCreatedTime: createdTime =>
      dispatch(LocalActions.setConferenceCreatedTime(createdTime))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConferenceScreenContainer);
