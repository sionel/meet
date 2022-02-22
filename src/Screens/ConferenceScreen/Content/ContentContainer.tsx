import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  GestureResponderEvent,
  NativeModules,
  Platform
} from 'react-native';
import ContentPresenter from './ContentPresenter';
import FileSharing from './FileSharing';
import { ConferenceModes } from '@utils/Constants';
import DeviceInfo from 'react-native-device-info';
import _ from 'underscore';

import { useDispatch, useSelector } from 'react-redux';
import { actionCreators as localAction } from '@redux/local';
import { actionCreators as mainUserAction } from '@redux/mainUser';
import { RootState } from '../../../redux/configureStore';
import { getConferenceManager } from '@utils/ConferenceManager';
import { ConferenceBotPopupContent } from './RenwalContent/Component/BottomPopup';
import { getT } from '@utils/translateManager';

export type ConferenceBottomPopupProps = {
  show: boolean;
  title: string;
  popupType: 'NORMAL' | 'USERLIST' | 'PROFILE' | 'CHATTING';
  contentList: ConferenceBotPopupContent[] | any;
};

const isIOS = Platform.OS === 'ios';
const InCallManager = !isIOS && require('react-native-incall-manager').default;

const { AudioMode } = NativeModules;
const hasNotch = DeviceInfo.hasNotch() && isIOS;

function ContentContainer(props: any) {
  const t = getT();
  const [orientation, setOrientation] = useState<'vertical' | 'horizontal'>(
    'vertical'
  );
  const [isMultipleView, setIsMultipleView] = useState(false);
  const [isVideoReverse, setIsVideoReverse] = useState(false);
  const [speaker, setSpeaker] = useState(2);
  const [objectFit, setObjectFit] = useState('cover');
  const [height, setHeight] = useState(Dimensions.get('window').height);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [limitedTime, setLimitedTime] = useState(3600000);

  const [bottomPopup, setBottomPopup] = useState<ConferenceBottomPopupProps>({
    show: false,
    contentList: [],
    title: '',
    popupType: 'NORMAL'
  });
  const [isPopupTouch, setIsPopupTouch] = useState(false);
  // console.log(props);

  const { mainUser, onClose, createdTime } = props;
  const { videoTrack, isMuteVideo } = mainUser;
  // const localPipMode = useSelector((state: RootState) => state.local.pipMode);
  const {
    conferenceMode,
    drawingMode,
    documentListMode,
    attributes,
    localPipMode,
    participants,
    user,
    auth,
    masters,
    expireTime
  } = useSelector((state: RootState) => {
    const { local, mainUser, documentShare, root, user, participants, master } =
      state;
    return {
      conferenceMode: local.conferenceMode,
      localPipMode: local.pipMode,
      expireTime: local.expireTime,
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

  // console.log('auth : ', auth);

  let userList = participants.slice(0);
  userList.unshift({
    ...user,
    userInfo: {
      profile_url: auth.profile_url,
      wehagoId: auth.portal_id,
      userName: auth.user_name,
      nickname: auth.nickname,
      companyFullpath: auth?.last_company?.full_path
        ? auth.last_company.full_path
        : '외부참여자',
      user_email: auth.user_default_email,
      user_contact: auth.user_contact
    }
  });

  userList.forEach((user: any) => {
    user.isMaster = masters.includes(user?.userInfo?.wehagoId);
  });

  // console.log('userList : ', userList);

  useEffect(() => {
    _handleChangeSpeaker();
    const _timer = setInterval(() => {
      if (createdTime) {
        if (expireTime !== null) {
          let limitTime = limitedTime - 500;
          let remainTime = Math.floor(limitTime / 1000);

          setElapsedTime(remainTime);
          setLimitedTime(limitTime);

          if (limitTime < 500) {
            onClose();
            Alert.alert('회의 종료', '회의시간이 60분 지나 회의가 종료됩니다.');
          }
        } else {
          let nowTime = Date.now();
          let normalTime = Math.floor((nowTime - createdTime) / 1000);

          normalTime > 0 && setElapsedTime(normalTime);
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

  useEffect(() => {
    isMultipleView && setConferenceMode(ConferenceModes.NORMAL);
  }, [isMultipleView]);

  const _toggleConferenceMode = (e: any) => {
    // if (isIOS) {
    if (!isMultipleView) {
      if (bottomPopup.show) {
        if (bottomPopup.popupType === 'CHATTING') {
          //채팅버튼 눌렀을 경우
        } else {
          !isPopupTouch &&
            setBottomPopup({
              ...bottomPopup,
              show: false
            });
        }
      } else if (!isMultipleView) {
        if (conferenceMode === ConferenceModes.CONTROL) {
          setConferenceMode(ConferenceModes.NORMAL);
        } else {
          setConferenceMode(ConferenceModes.CONTROL);
        }
      }
    }
    // } else {
    //   if (conferenceMode === ConferenceModes.CONTROL) {
    //     setConferenceMode(ConferenceModes.NORMAL);
    //   } else {
    //     setConferenceMode(ConferenceModes.CONTROL);
    //   }
    // }
  };

  const handelProfieBackButton = () => {
    setBottomPopup({
      ...bottomPopup,
      contentList: userList,
      title: t('참석자리스트'),
      popupType: 'USERLIST'
    });
    setIsPopupTouch(false);
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

  // console.log('attributes : ', attributes);

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
      handelProfieBackButton={handelProfieBackButton}
      setIsPopupTouch={setIsPopupTouch}
      limitedTime={limitedTime}
      setLimitedTime={setLimitedTime}
    />
  );
}

export default ContentContainer;
