import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, NativeModules, Platform } from 'react-native';
import ContentPresenter from './ContentPresenter';
import FileSharing from './FileSharing';
import { ConferenceModes } from '@utils/Constants';
import DeviceInfo from 'react-native-device-info';
import Orientation from 'react-native-orientation-locker';
import _ from 'underscore';

import { useDispatch, useSelector } from 'react-redux';
import { actionCreators as localAction } from '@redux/local';
import { actionCreators as mainUserAction } from '@redux/mainUser';
import { RootState } from '../../../redux/configureStore';
import { getConferenceManager } from '@utils/ConferenceManager';
import { ConferenceBotPopupContent } from './RenwalContent/Component/BottomPopup';

export type ConferenceBottomPopupProps = {
  show: boolean;
  contentList: ConferenceBotPopupContent[];
  title: string;
};

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
  const [isMultipleView, setIsMultipleView] = useState(false);
  const [isVideoReverse, setIsVideoReverse] = useState(false);
  const [speaker, setSpeaker] = useState(2);
  const [objectFit, setObjectFit] = useState('cover');
  const [height, setHeight] = useState(Dimensions.get('window').height);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [bottomPopup, setBottomPopup] = useState<ConferenceBottomPopupProps>({
    show: false,
    contentList: [],
    title: ''
  });

  const { mainUser, onClose, createdTime } = props;
  const { videoTrack, isMuteVideo } = mainUser;
  // const localPipMode = useSelector((state: RootState) => state.local.pipMode);
  const {
    conferenceMode,
    drawingMode,
    documentListMode,
    attributes,
    localPipMode,
    videoPolicy,
    loginType,
    participants,
    user,
    auth,
    masters
  } = useSelector((state: RootState) => {
    const { local, mainUser, documentShare, root, user, participants, master } =
      state;
    return {
      conferenceMode: local.conferenceMode,
      localPipMode: local.pipMode,
      user: local.user,
      drawingMode: mainUser.drawingMode,
      documentListMode: mainUser.documentListMode,
      attributes: documentShare.attributes,
      videoPolicy: root.videoPolicy,
      loginType: user.loginType,
      auth: user.auth,
      participants: participants.list,
      masters: master.masterList
    };
  });

  const dispatch = useDispatch();
  const setConferenceMode = (mode: any) =>
    dispatch(localAction.setConferenceMode(mode));
  // const setDrawingMode = (value: any) =>
  //   dispatch(mainUserAction.setDrawingMode(value));
  const setDocumentListMode = (value: any) =>
    dispatch(mainUserAction.setDocumentListMode(value));

  let userList = participants.slice(0);
  userList.unshift({
    ...user,
    userInfo: {
      profile_url: auth.profile_url,
      wehagoId: auth.portal_id,
      userName: auth.user_name,
      nickname: auth.nickname
    }
  });
  userList.forEach((user: any) => {
    user.isMaster = masters.includes(user?.userInfo?.wehagoId);
  });

  useEffect(() => {
    _handleChangeSpeaker();
    const _timer = setInterval(() => {
      if (createdTime) {
        let time = Math.floor((Date.now() - createdTime) / 1000);
        time > 0 && setElapsedTime(time);
        if (
          (videoPolicy === 'nahago' || loginType === 'nahago') &&
          time >= 3600
        ) {
          Alert.alert('회의 종료', '회의시간이 60분 지나 회의가 종료됩니다.', [
            {
              text: '확인',
              onPress: () => {
                onClose();
              }
            }
          ]);
        }
      }
    }, 500);
    return () => {
      _timer && clearInterval(_timer);
    };
  }, [createdTime]);

  useEffect(() => {
    const m = getConferenceManager();
    if (mainUser.id !== 'localUser') m?.setReceiverConstraints(mainUser.id);
  }, [mainUser]);

  const _toggleConferenceMode = () => {
    if (conferenceMode === ConferenceModes.CONTROL ) {
      !isMultipleView && setConferenceMode(ConferenceModes.NORMAL);
    } else {
      !isMultipleView && setConferenceMode(ConferenceModes.CONTROL);
    }

    if (bottomPopup.show) {
      setBottomPopup({
        ...bottomPopup,
        show: false
      });
    }
  };

  // const _setOrientation = () => {
  //   const { width, height } = Dimensions.get('window');
  //   const currentOrientation = height > width ? 'vertical' : 'horizontal';
  //   if (orientation !== currentOrientation) {
  //     setOrientation(currentOrientation);
  //     setHeight(Math.max(width, height));
  //   }
  // };

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
      // onLayout={_setOrientation}
      onChangeSpeaker={_handleChangeSpeaker}
      elapsedTime={elapsedTime}
      // onChangeState={_handleChangeState}
      bottomPopup={bottomPopup}
      handleBottomPopup={setBottomPopup}
      userList={userList}
      isMultipleView={isMultipleView}
      setIsMultipleView={setIsMultipleView}
    />
  );
}

export default ContentContainer;
