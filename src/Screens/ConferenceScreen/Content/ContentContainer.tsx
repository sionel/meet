import React, { useEffect, useState } from 'react';
import { Dimensions, NativeModules, Platform } from 'react-native';
import ContentPresenter from './ContentPresenter';
import FileSharing from './FileSharing';
import { ConferenceModes } from '../../../utils/Constants';
import DeviceInfo from 'react-native-device-info';
import Orientation from 'react-native-orientation-locker';
import _ from 'underscore';

import { useDispatch, useSelector } from 'react-redux';
import { actionCreators as localAction } from '../../../redux/modules/local';
import { actionCreators as mainUserAction } from '../../../redux/modules/mainUser';
import { RootState } from '../../../redux/configureStore';
import { getConferenceManager } from '../../../utils/ConferenceManager';

const isIOS = Platform.OS === 'ios';
const InCallManager = !isIOS && require('react-native-incall-manager').default;

const { AudioMode } = NativeModules;
const hasNotch = DeviceInfo.hasNotch() && isIOS;

function ContentContainer(props: any) {
  // state = {
  //   orientation:
  //     Dimensions.get('window').height > Dimensions.get('window').width
  //       ? 'vertical'
  //       : 'horizontal',
  //   isVideoReverse: false,
  //   speaker: 2,
  //   objectFit: 'contain',

  const [orientation, setOrientation] = useState<'vertical' | 'horizontal'>(
    'vertical'
  );
  const [isVideoReverse, setIsVideoReverse] = useState(false);
  const [speaker, setSpeaker] = useState(2);
  const [objectFit, setObjectFit] = useState('contain');
  const [height, setHeight] = useState(Dimensions.get('window').height);
  const { mainUser } = props;
  const { videoTrack, isMuteVideo } = mainUser;
  // const localPipMode = useSelector((state: RootState) => state.local.pipMode);
  const {
    conferenceMode,
    drawingMode,
    documentListMode,
    attributes,
    localPipMode
  } = useSelector((state: RootState) => {
    return {
      conferenceMode: state.local.conferenceMode,
      drawingMode: state.mainUser.drawingMode,
      documentListMode: state.mainUser.documentListMode,
      attributes: state.documentShare.attributes,
      localPipMode: state.local.pipMode
    };
  });

  const dispatch = useDispatch();
  const setConferenceMode = (mode: any) =>
    dispatch(localAction.setConferenceMode(mode));
  const setDrawingMode = (value: any) =>
    dispatch(mainUserAction.setDrawingMode(value));
  const setDocumentListMode = (value: any) =>
    dispatch(mainUserAction.setDocumentListMode(value));

  useEffect(() => {
    _handleChangeSpeaker();
    Orientation.addOrientationListener(_setOrientation);
    return () => {
      Orientation.removeOrientationListener(_setOrientation);
    };
  }, []);

  useEffect(() => {
    const m = getConferenceManager();
    if (mainUser.id !== 'localUser') m?.setReceiverConstraints(mainUser.id);
  }, [mainUser]);

  const _toggleConferenceMode = () => {
    if (conferenceMode === ConferenceModes.CONTROL) {
      setConferenceMode(ConferenceModes.NORMAL);
    } else {
      setConferenceMode(ConferenceModes.CONTROL);
    }
  };

  const _setOrientation = () => {
    const { width, height } = Dimensions.get('window');
    const currentOrientation = height > width ? 'vertical' : 'horizontal';
    if (orientation !== currentOrientation) {
      setOrientation(currentOrientation);
      setHeight(Math.max(width, height));
    }
  };

  const _handleReverseVideo = _.throttle(() => {
    setIsVideoReverse(!isVideoReverse);
  }, 1000);

  const _handleChangeSpeaker = () => {
    setSpeaker(speaker == 2 ? 1 : 2);
    if (isIOS) {
      AudioMode.setAudioDevice(
        speaker === 1 ? 'Built-In Microphone' : 'SPEAKER'
      );
    } else {
      InCallManager &&
        InCallManager.setSpeakerphoneOn &&
        InCallManager.setSpeakerphoneOn(speaker == 2);
    }
  };

  return attributes ? (
    <FileSharing
      {...props}
      height={height}
      speaker={speaker}
      orientation={orientation}
      hasNotch={hasNotch}
      onChangeSpeaker={_handleChangeSpeaker}
    />
  ) : (
    <ContentPresenter
      {...{
        orientation,
        isVideoReverse,
        speaker,
        objectFit,
        height,
        localPipMode,
        videoTrack,
        isMuteVideo,
        drawingMode,
        documentListMode,
        attributes,
        mainUser,
        conferenceMode
      }}
      {...props}
      hasNotch={hasNotch}
      toggleConferenceMode={_toggleConferenceMode}
      onReverseVideo={_handleReverseVideo}
      onLayout={_setOrientation}
      onChangeSpeaker={_handleChangeSpeaker}
      // onChangeState={_handleChangeState}
    />
  );
}

export default ContentContainer;
