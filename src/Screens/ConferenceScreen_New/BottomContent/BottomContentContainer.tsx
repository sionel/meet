import React, { useEffect, useState } from 'react';
import { NativeModules, Platform } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { actionCreators as ConferenceActions } from '@redux/conference';

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
  const { videoState, mikeState, isSpeakerOn, isBtOn } = useSelector(
    (state: RootState) => ({
      videoState: state.conference.videoState,
      mikeState: state.conference.mikeState,
      isSpeakerOn: state.conference.isSpeakerOn,
      isBtOn: state.conference.isBtOn
    })
  );

  const [isVideoOn, setIsVideoOn] = useState(!videoState.isMuted());
  const [isMikeOn, setIsMikeOn] = useState(!mikeState.isMuted());

  const dispatch = useDispatch();
  const setIsSpeakerOn = (isSpeakerOn: boolean) => {
    dispatch(ConferenceActions.setIsSpeakerOn(isSpeakerOn));
  };

  useEffect(() => {
    _handlePressSpeaker();
    return () => {};
  }, []);

  const _handlePressVideo = () => {
    if (isVideoOn) {
      videoState.mute();
    } else {
      videoState.unmute();
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
    console.log('isBtOn : ', isBtOn);

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
