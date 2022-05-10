import React, { useEffect, useState } from 'react';
import { NativeModules, Platform } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { actionCreators as ConferenceActions } from '@redux/conference';
import { actionCreators as ToastActions } from '@redux/toast';
import { actionCreators as MainUserActions } from '@redux/mainUser_copy';
import { actionCreators as MasterActions } from '@redux/master';

import { RootState } from 'src/redux/configureStore';
import { BottomContentContainerProps } from '../types';

import BottomContentPresenter from './BottomContentPresenter';
import { useTranslation } from 'react-i18next';

const { OS } = Platform;
const AudioMode = OS === 'ios' && NativeModules.AudioMode;
const InCallManager =
  OS === 'android' && require('react-native-incall-manager').default;

const BottomContentContainer: React.FC<BottomContentContainerProps> = ({
  handleCloseConf
}) => {
  //#region selector
  const {
    videoState,
    mikeState,
    isSpeakerOn,
    isBtOn,
    isMuteMike,
    room,
    isMasterControl,
    isAudioActive,
    isMicRequest,
    mode,
    isLocal,
    isMuteVideo,
    myName
  } = useSelector((state: RootState) => ({
    videoState: state.conference.videoState,
    mikeState: state.conference.mikeState,
    isSpeakerOn: state.conference.isSpeakerOn,
    isBtOn: state.conference.isBtOn,
    isMuteMike: state.conference.isMuteMike,
    room: state.conference.room,
    isMasterControl: state.master.isMasterControl,
    isAudioActive: state.master.isAudioActive,
    isMicRequest: state.master.isMicRequest,
    mode: state.mainUser_copy.mode,
    isLocal: state.mainUser_copy.isLocal,
    isMuteVideo: state.mainUser_copy.isMuteVideo,
    myName: state.participants_copy.list[0].name
  }));
  //#endregion

  // console.log('BotContent');
  
  const { t } = useTranslation();
  const [isVideoOn, setIsVideoOn] = useState(!videoState.isMuted());
  // const [isMikeOn, setIsMikeOn] = useState(!isMuteMike);

  //#region dispatch
  const dispatch = useDispatch();
  const setIsSpeakerOn = (isSpeakerOn: boolean) =>
    dispatch(ConferenceActions.setIsSpeakerOn(isSpeakerOn));
  const toggleMuteVideo = () => dispatch(MainUserActions.toggleMuteVideo());
  const setToastMessage = (message: string) =>
    dispatch(ToastActions.setToastMessage(message));
  const setMicRequest = (requestFlag: any) => {
    dispatch(MasterActions.setMicRequest(requestFlag));
  };
  const setIsMuteMike = (flag: boolean) => {
    dispatch(ConferenceActions.setIsMuteMike(flag));
  };
  //#endregion

  useEffect(() => {
    _handlePressSpeaker();
    return () => {};
  }, []);

  useEffect(() => {
    if (isLocal) {
      setIsVideoOn(!isMuteVideo);
    }
  }, [isMuteVideo]);

  const _handlePressVideo = () => {
    if (isVideoOn) {
      videoState.mute();
    } else {
      videoState.unmute();
    }
    setIsVideoOn(!isVideoOn);
    isLocal && toggleMuteVideo();
  };

  const _handlePressMike = () => {
    //마스터가 마이크를 제어중일때
    if (isMasterControl) {
      if (isAudioActive) {
        // 참가자는 마스터가 제어중일때 오디오가 꺼져있으면 직접 컨트롤 할 수 없음
      } else {
        if (!isMuteMike) {
          room && room.sendMessage.stopAttention(myName);
          setToastMessage(t('toast_master_finish'));
          setIsMuteMike(!isMuteMike);
        } else {
          if (isMicRequest) {
            setToastMessage(t('toast_master_waiting'));
          } else {
            room && room.sendMessage.requestAttention(myName);
            setMicRequest(true);
            setToastMessage(t('toast_master_ask'));
          }
        }
      }
    } else {
      // if (!isMuteMike) {
      //   mikeState.mute();
      // } else {
      //   mikeState.unmute();
      // }
      setIsMuteMike(!isMuteMike);
    }
  };

  const _handlePressSpeaker = () => {
    if (!isBtOn) {
      if (OS === 'ios') {
        if (isSpeakerOn) {
          AudioMode.setAudioDevice('Built-In Microphone');
        } else {
          AudioMode.setAudioDevice('SPEAKER');
        }
      } else {
        // android
        if (isSpeakerOn) {
          InCallManager.setForceSpeakerphoneOn(false);
        } else {
          InCallManager.chooseAudioRoute('SPEAKER_PHONE');
        }
      }
      setIsSpeakerOn(!isSpeakerOn);
    }
  };

  return (
    <BottomContentPresenter
      onPressSpeaker={_handlePressSpeaker}
      onPressMike={_handlePressMike}
      onPressVideo={_handlePressVideo}
      onPressEndCall={handleCloseConf}
      isVideoOn={isVideoOn}
      isMikeOn={!isMuteMike}
      isSpeakerOn={isSpeakerOn}
      mode={mode}
    />
  );
};
export default BottomContentContainer;
