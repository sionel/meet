import React, { useEffect, useState } from 'react';
import {
  DeviceEventEmitter,
  Dimensions,
  NativeEventEmitter,
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

import { getT } from '../../../utils/translateManager';

const isIOS = Platform.OS === 'ios';
const AudioMode = isIOS && NativeModules.AudioMode;
const NativeAudio = new NativeEventEmitter(AudioMode);

type speakerInfo = {
  name: string;
  selected: boolean;
  type: string;
  uid: string;
};

const InCallManager = !isIOS && require('react-native-incall-manager').default;
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
  const [isLink, setIsLink] = useState(false);

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
    const { local, master, mainUser, documentShare } = state;
    return {
      conferenceMode: local.conferenceMode,
      drawingMode: mainUser.drawingMode,
      documentListMode: documentShare.documentListMode,
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

  const androidAudioInit = (event: any) => {
    const { availableAudioDeviceList } = event;
    const deviceList = JSON.parse(availableAudioDeviceList);
    let enableBluetooth = false;
    enableBluetooth = deviceList.find((list: string) => list === 'BLUETOOTH');

    if (enableBluetooth) {
      InCallManager.chooseAudioRoute('BLUETOOTH');
      speaker === 2 && setSpeaker(1);
      setIsLink(true);
    } else {
      setIsLink(false);
    }
  };

  const audioInit = async () => {
    if (isIOS) {
      const kDevicesChanged =
        'org.jitsi.meet:features/audio-mode#devices-update';
      let enableBluetooth: any = false;

      NativeAudio.addListener(kDevicesChanged, event => {
        enableBluetooth = event.find(
          (deviceInfo: speakerInfo) =>
            deviceInfo.selected === true && deviceInfo.type === 'BLUETOOTH'
        );
        if (enableBluetooth) {
          speaker === 2 && setSpeaker(1);
          setIsLink(true);
        } else {
          setIsLink(false);
        }
      });
    } else {
      InCallManager.start({ media: 'video' });

      const audioPermmit = await InCallManager.requestRecordPermission();
      if (audioPermmit !== 'granted') {
        InCallManager.requestRecordPermission();
      }

      DeviceEventEmitter.addListener('onAudioDeviceChanged', event => {
        androidAudioInit(event);
      });
    }
  };
  
  useEffect(() => {
    audioInit();
    _handleChangeSpeaker();
    Orientation.addOrientationListener(_setOrientation);
    return () => {
      Orientation.removeOrientationListener(_setOrientation);
      if (isIOS) {
        const kDevicesChanged =
          'org.jitsi.meet:features/audio-mode#devices-update';
        NativeAudio.removeAllListeners(kDevicesChanged);
      } else {
        DeviceEventEmitter.removeListener('onAudioDeviceChanged', event => {
          androidAudioInit(event);
        });
      }
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
    let stateSpeaker = speaker === 2 ? 1 : 2;

    if (!isLink) {
      setSpeaker(speaker === 2 ? 1 : 2);

      if (isIOS) {
        if (stateSpeaker === 2) {
          AudioMode.setAudioDevice('Built-In Microphone');
        } else {
          AudioMode.setAudioDevice('SPEAKER');
        }
      } else {
        // android
        if (stateSpeaker === 2) {
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
