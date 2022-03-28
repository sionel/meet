import React, { useEffect, useState } from 'react';
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
import { Dimensions, Platform } from 'react-native';
import deviceInfoModule from 'react-native-device-info';

const isTablet = deviceInfoModule.isTablet();
const { width, height } = Dimensions.get('screen');

type BottomAreaProps = {
  orientation: any;
  callType: number;
  speaker: number;
  onClose: () => void;
  onChangeSpeaker: () => void;
  onChangeMicMaster: () => void;
  handleToggleMic: () => void;
  userList: ParticipantsTypes[];
  isMultipleView: boolean;
  setIsMultipleView: React.Dispatch<React.SetStateAction<boolean>>;
  bottomPopup: ConferenceBottomPopupProps;
};

const BottomAreaContainer = (props: BottomAreaProps) => {
  const t = getT();

  const [width, setWidth] = useState(Dimensions.get('screen').width);
  const [height, setHeight] = useState(Dimensions.get('screen').height);

  //#region SELELTOR
  const {
    conferenceMode,
    isScreenShare,
    isMasterControl,
    isAudioActive,
    masters,
    isMuteMic,
    isMuteVideo,
    isMicRequest,
    name,
    user,
    mainUserId,
    list,
    orientation,
    authID
  } = useSelector((state: RootState) => {
    const { local, screenShare, master, mainUser, participants, orientation, user } =
      state;
    return {
      conferenceMode: local.conferenceMode,
      isMuteMic: local.user.isMuteMic,
      isMuteVideo: local.user.isMuteVideo,
      name: local.user.name,
      masters: master.masterList,
      isMicRequest: master.isMicRequest,
      isMasterControl: master.isMasterControl,
      isAudioActive: master.isAudioActive,
      isScreenShare: screenShare.isScreenShare,
      user: local.user,
      mainUserId: mainUser.mainUserId,
      list: participants.list,
      orientation: orientation.orientation,
      authID: user.auth.portal_id
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

  useEffect(() => {
    const updateLayout = () => {
      setWidth(Dimensions.get('screen').width);
      setHeight(Dimensions.get('screen').height);
    };

    Dimensions.addEventListener('change', updateLayout);

    return () => {
      Dimensions.removeEventListener('change', updateLayout);
    };
  });

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
      handleToggleMic={props.handleToggleMic}
      toggleMuteVideo={toggleMuteVideo}
      // toggleMuteMic={toggleMuteMic}
      user={user}
      mainUserId={mainUserId}
      list={list}
      userList={props.userList}
      isMultipleView={props.isMultipleView}
      setIsMultipleView={props.setIsMultipleView}
      bottomPopup={props.bottomPopup}
      // multiViewH={multiViewH}
      width={width}
      height={height}
    />
  );
};

export default BottomAreaContainer;
