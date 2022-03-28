import React, { useEffect, useState } from 'react';
import {
  DeviceEventEmitter,
  Dimensions,
  NativeModules,
  Platform
} from 'react-native';
import ContentPresenter from './ContentPresenter';
import FileSharing from './FileSharing';
import { ConferenceModes } from '../../../utils/Constants';
import DeviceInfo from 'react-native-device-info';
import Orientation from 'react-native-orientation-locker';
import _ from 'underscore';

import { useDispatch, useSelector } from 'react-redux';
import { actionCreators as localAction } from '../../../redux/modules/local';
import { actionCreators as masterAction } from '../../../redux/modules/master';
import { actionCreators as toastAction } from '../../../redux/modules/toast';
import { RootState } from '../../../redux/configureStore';
import { getConferenceManager } from '../../../utils/ConferenceManager';
import InCallManager from 'react-native-incall-manager';
import { BluetoothStatus } from 'react-native-bluetooth-status';
import { getT } from '../../../utils/translateManager';

const isIOS = Platform.OS === 'ios';

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
  const [limitedTime, setLimitedTime] = useState(3600000);

  const t = getT();

  // const localPipMode = useSelector((state: RootState) => state.local.pipMode);
  const {
    conferenceMode,
    drawingMode,
    documentListMode,
    attributes,
    localPipMode,
    isMuteMic,
    isAudioActive,
    name,
    isMicRequest,
    isMasterControl
  } = useSelector((state: RootState) => {
    const { local, master, documentShare } = state;
    return {
      conferenceMode: local.conferenceMode,
      drawingMode: mainUser.drawingMode,
      documentListMode: mainUser.documentListMode,
      attributes: documentShare.attributes,
      localPipMode: local.pipMode,
      isMuteMic: local.user.isMuteMic,
      isAudioActive: master.isAudioActive,
      name: local.user.name,
      isMicRequest: master.isMicRequest,
      isMasterControl: master.isMasterControl
    };
  });

  const dispatch = useDispatch();
  const setConferenceMode = (mode: any) =>
    dispatch(localAction.setConferenceMode(mode));
    const setToastMessage = (msg: string) =>
    dispatch(toastAction.setToastMessage(msg));
  const setMicRequest = (flag: any) =>
    dispatch(masterAction.setMicRequest(flag));
  const toggleMuteMic = () => dispatch(localAction.toggleMuteMic(undefined));

  const audioInit = async () => {
    InCallManager.start({ media: 'video', auto: true });

    const audioPermmit = await InCallManager.requestRecordPermission();
    if (audioPermmit !== 'granted') {
      InCallManager.requestRecordPermission();
    }

    if (!isIOS) {
      DeviceEventEmitter.addListener('onAudioDeviceChanged', event => {
        const { availableAudioDeviceList } = event;
        const deviceList = JSON.parse(availableAudioDeviceList);
        let enableBluetooth = false;
        enableBluetooth = deviceList.find(
          (list: string) => list === 'BLUETOOTH'
        );
        if (enableBluetooth) {
          InCallManager.chooseAudioRoute('BLUETOOTH');
        }
      });
    }
  };
  useEffect(() => {
    audioInit();
    _handleChangeSpeaker();
    BluetoothStatus.listener = _handleChangeSpeaker;
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

  const _handleChangeSpeaker = async () => {
    const bluetooth = await BluetoothStatus.state();

    if (!bluetooth) {
      setSpeaker(speaker === 2 ? 1: 2);


      if (isIOS) {
        if (speaker === 2) {
          InCallManager.setSpeakerphoneOn(false);
          InCallManager.setForceSpeakerphoneOn(false);
        } else {
          InCallManager.setSpeakerphoneOn(true);
          InCallManager.setForceSpeakerphoneOn(true);
        }
      } else {
        // android
        if (speaker === 2) {
          InCallManager.setForceSpeakerphoneOn(false);
        } else {
          InCallManager.chooseAudioRoute('SPEAKER_PHONE');
        }
      }
    }
  };

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

  return attributes ? (
    <FileSharing
      {...props}
      height={height}
      speaker={speaker}
      orientation={orientation}
      hasNotch={hasNotch}
      onChangeSpeaker={_handleChangeSpeaker}
      handleToggleMic={_handleToggleMic}
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
      limitedTime={limitedTime}
      setLimitedTime={setLimitedTime}
      handleToggleMic={_handleToggleMic}
      // onChangeState={_handleChangeState}
    />
  );
}

export default ContentContainer;
