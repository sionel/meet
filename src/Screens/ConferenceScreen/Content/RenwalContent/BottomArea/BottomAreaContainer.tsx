import React, { useState } from 'react';
import { getConferenceManager } from '@utils/ConferenceManager';
import { getT } from '@utils/translateManager';
import BottomAreaPresenter from './BottomAreaPresenter';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/configureStore';
import { actionCreators as localActionCreators } from '@redux/local';
import { actionCreators as masterActionCreators } from '@redux/master';
import { actionCreators as toastActionCreators } from '@redux/toast';
import { ParticipantsTypes } from '@redux/participants';
import { ConferenceBottomPopupProps } from '../../ContentContainer';

type BottomAreaProps = {
  orientation: any;
  callType: number;
  speaker: number;
  onClose: () => void;
  onChangeSpeaker: () => void;
  onChangeMicMaster: () => void;
  userList: ParticipantsTypes[];
  isMultipleView: boolean;
  setIsMultipleView: () => void;
  bottomPopup: ConferenceBottomPopupProps;
};

const BottomAreaContainer = (props: BottomAreaProps) => {
  const t = getT();
  //#region SELELTOR
  const {
    conferenceMode,
    isScreenShare,
    isMasterControl,
    isAudioActive,
    isMuteMic,
    isMuteVideo,
    isMicRequest,
    name,
    user,
    mainUserId,
    list,
    orientation
  } = useSelector((state: RootState) => {
    const { local, screenShare, master, mainUser, participants, orientation } =
      state;
    return {
      conferenceMode: local.conferenceMode,
      isMuteMic: local.user.isMuteMic,
      isMuteVideo: local.user.isMuteVideo,
      name: local.user.name,
      isMicRequest: master.isMicRequest,
      isMasterControl: master.isMasterControl,
      isAudioActive: master.isAudioActive,
      isScreenShare: screenShare.isScreenShare,
      user: local.user,
      mainUserId: mainUser.mainUserId,
      list: participants.list,
      orientation: orientation.orientation
    };
  });
  //#endregion

  //#region DISPATCH
  const dispatch = useDispatch();
  const toggleMuteVideo = () => dispatch(localActionCreators.toggleMuteVideo());
  const toggleMuteMic = () => dispatch(localActionCreators.toggleMuteMic());
  const setToastMessage = (msg: string) =>
    dispatch(toastActionCreators.setToastMessage(msg));
  const setMicRequest = (flag: any) =>
    dispatch(masterActionCreators.setMicRequest(flag));
  //#endregion

  const _handleToggleMic = () => {
    let conferenceManager = getConferenceManager();

    if (isMasterControl) {
      if (isAudioActive) {
        // 참가자는 마스터가 제어중일때 오디오가 꺼져있으면 직접 컨트롤 할 수 없음
      } else {
        if (isMuteMic) {
          if (isMicRequest) {
            setToastMessage(t('toast_master_waiting'));
          } else {
            conferenceManager.requestAttention(name);
            setMicRequest(true);
            setToastMessage(t('toast_master_ask'));
          }
        } else {
          conferenceManager.stopAttention(name);
          setToastMessage(t('toast_master_finish'));
          toggleMuteMic();
        }
      }
    } else {
      toggleMuteMic();
    }
  };
  return (
    <BottomAreaPresenter
      orientation={orientation}
      callType={props.callType}
      speaker={props.speaker}
      onChangeSpeaker={props.onChangeSpeaker}
      onClose={props.onClose}
      onChangeMicMaster={props.onChangeMicMaster}
      conferenceMode={conferenceMode}
      isScreenShare={isScreenShare}
      isMuteMic={isMuteMic}
      isMuteVideo={isMuteVideo}
      handleToggleMic={_handleToggleMic}
      toggleMuteVideo={toggleMuteVideo}
      toggleMuteMic={toggleMuteMic}
      user={user}
      mainUserId={mainUserId}
      list={list}
      userList={props.userList}
      isMultipleView={props.isMultipleView}
      setIsMultipleView={props.setIsMultipleView}
      bottomPopup={props.bottomPopup}
    />
  );
};

export default BottomAreaContainer;
