import React, { useEffect, useState } from 'react';
import { NativeModules, Platform } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { actionCreators as ConferenceActions } from '@redux/conference';
import { actionCreators as MainUserActions } from '@redux/mainUser_copy';

import { RootState } from 'src/redux/configureStore';
import { BottomContentContainerProps } from '../types';

import BottomContentPresenter from './BottomContentPresenter';

const { OS } = Platform;
const AudioMode = OS === 'ios' && NativeModules.AudioMode;
const InCallManager =
  OS === 'android' && require('react-native-incall-manager').default;

const BottomContentContainer: React.FC<BottomContentContainerProps> = ({
  handleCloseConf
}) => {
  //#region selector
  const { videoState, mikeState, isSpeakerOn, isBtOn } = useSelector(
    (state: RootState) => ({
      videoState: state.conference.videoState,
      mikeState: state.conference.mikeState,
      isSpeakerOn: state.conference.isSpeakerOn,
      isBtOn: state.conference.isBtOn
    })
  );
  //#endregion

  const [isVideoOn, setIsVideoOn] = useState(!videoState.isMuted());
  const [isMikeOn, setIsMikeOn] = useState(!mikeState.isMuted());

  //#region dispatch
  const dispatch = useDispatch();
  const setIsSpeakerOn = (isSpeakerOn: boolean) =>
    dispatch(ConferenceActions.setIsSpeakerOn(isSpeakerOn));

  const setMainView = (
    view: 'track' | 'sketch' | 'document' | 'screen' | 'character'
  ) => dispatch(MainUserActions.setMainView(view));
  //#endregion

  useEffect(() => {
    _handlePressSpeaker();
    return () => {};
  }, []);

  const _handlePressVideo = () => {
    if (isVideoOn) {
      videoState.mute();
      setMainView('character');
    } else {
      videoState.unmute();
      setMainView('track');
    }
    setIsVideoOn(!isVideoOn);
  };

  const _handlePressMike = () => {
    if (isMikeOn) {
      mikeState.mute();
    } else {
      mikeState.unmute();
    }
    setIsMikeOn(!isMikeOn);
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
      isMikeOn={isMikeOn}
      isSpeakerOn={isSpeakerOn}
    />
  );
};
export default BottomContentContainer;