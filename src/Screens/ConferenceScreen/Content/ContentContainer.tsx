import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  DeviceEventEmitter,
  Dimensions,
  Linking,
  NativeTouchEvent,
  Platform,
  Share
} from 'react-native';

import Clipboard from '@react-native-clipboard/clipboard';
import DeviceInfo from 'react-native-device-info';
import InCallManager from 'react-native-incall-manager';
import _ from 'underscore';

import ContentPresenter from './ContentPresenter';
import FileSharing from './FileSharing';
import { ConferenceBotPopupContent } from './RenwalContent/Component/BottomPopup';

import { useDispatch, useSelector } from 'react-redux';
import { actionCreators as localAction } from '@redux/local';
import { actionCreators as mainUserAction } from '@redux/mainUser';
import { actionCreators as toastActionCreators } from '@redux/toast';
import { RootState } from '../../../redux/configureStore';

import icOrganizationW from '@assets/icons/ic_organization_w.png';
import icMailW from '@assets/icons/ic_mail_w.png';
import icPhoneW from '@assets/icons/ic_phone_w.png';
import icShareW from '@assets/icons/ic_share_w.png';
import icLinkW from '@assets/icons/ic_link_w.png';
import icCodeW from '@assets/icons/ic_code.png';

import { getConferenceManager } from '@utils/ConferenceManager';
import { getT } from '@utils/translateManager';
import { ConferenceModes } from '@utils/Constants';
import { MeetApi } from '@services/index';
import { isSuccess } from '@services/types';

export type ConferenceBottomPopupProps = {
  show: boolean;
  title: string;
  popupType: 'NORMAL' | 'USERLIST' | 'PROFILE' | 'CHATTING';
  contentList: ConferenceBotPopupContent[] | any;
};

const isIOS = Platform.OS === 'ios';

const hasNotch = DeviceInfo.hasNotch() && isIOS;

const { height: screenHeight } = Dimensions.get('screen');

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
  const [micControlMode, setIsMicControlMode] = useState(false);

  const [bottomPopup, setBottomPopup] = useState<ConferenceBottomPopupProps>({
    show: false,
    contentList: [],
    title: '',
    popupType: 'NORMAL'
  });

  // console.log('bottomPopup.contentList : ', bottomPopup.contentList);

  const [isPopupTouch, setIsPopupTouch] = useState(false);
  // console.log('props : ', props);

  const { mainUser, onClose, createdTime, id: roomId, avatar } = props;
  // console.log(roomId);

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
    expireTime,
    isLogin,
    isScreenShare
  } = useSelector((state: RootState) => {
    const {
      local,
      mainUser,
      documentShare,
      root,
      user,
      participants,
      master,
      screenShare
    } = state;
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
      isLogin: user.isLogin,
      participants: participants.list,
      masters: master.masterList,
      isScreenShare: screenShare.isScreenShare
    };
  });

  const dispatch = useDispatch();
  const setConferenceMode = (mode: any) =>
    dispatch(localAction.setConferenceMode(mode));
  const setDocumentListMode = (value: any) =>
    dispatch(mainUserAction.setDocumentListMode(value));
  const setToastMessage = (msg: string) =>
    dispatch(toastActionCreators.setToastMessage(msg));

  let userList = participants.slice(0);

  if (auth.portal_id) {
    userList.unshift({
      ...user,
      userInfo: {
        profile_url: auth.profile_url,
        wehagoId: auth.portal_id,
        userName: auth.user_name,
        nickname: auth.nickname,
        companyFullpath: auth?.last_company?.full_path
          ? auth.last_company.full_path
          : undefined,
        user_email: auth.user_default_email,
        user_contact: auth.user_contact,
        isExternalParticipant: `${!isLogin}`,
        isMobile: true,
        avatar: avatar
      }
    });
  } else {
    userList.unshift({
      ...user,
      userInfo: {
        userName: user.name,
        isMobile: true,
        isExternalParticipant: `${!isLogin}`,
        avatar: avatar
      }
    });
  }
  userList.forEach((user: any) => {
    user.isMaster = masters.includes(user?.userInfo?.wehagoId);
  });

  // console.log('userList : ', userList);

  useEffect(() => {
    audioInit();
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
    isMultipleView && setConferenceMode(ConferenceModes.CONTROL);
  }, [isMultipleView]);

  useEffect(() => {
    if (bottomPopup.show === true && bottomPopup.popupType === 'USERLIST') {
      setTimeout(() => {
        setBottomPopup({ ...bottomPopup, contentList: userList });
      }, 2000);
    }
  }, [userList.length]);

  const audioInit = async () => {
    InCallManager.start({ media: 'audio', auto: true });

    const audioPermmit = await InCallManager.requestRecordPermission();
    if (audioPermmit !== 'granted') {
      InCallManager.requestRecordPermission();
    }

    if (isIOS) {
    } else {
      DeviceEventEmitter.addListener('onAudioDeviceChanged', event => {
        console.log('onAudioDeviceChanged: ', event.selectedAudioDevice);
        InCallManager.updateAudioDeviceState;
        //TODO: 이거 필요한 함수인지 확인필요함
      });
    }
  };

  const _toggleConferenceMode = (NativeTouchEvent: NativeTouchEvent) => {
    const { pageY } = NativeTouchEvent;

    if (!isMultipleView) {
      if (bottomPopup.show) {
        if (bottomPopup.popupType === 'CHATTING') {
          // 채팅버튼 눌렀을 경우
        } else {
          !isPopupTouch &&
            setBottomPopup({
              ...bottomPopup,
              show: false
            });
        }
      } else if (screenHeight * 0.15 > pageY) {
        // 상단버튼
      } else if (screenHeight * 0.84 < pageY) {
        // 하단버튼
      } else {
        if (conferenceMode === ConferenceModes.CONTROL) {
          setConferenceMode(ConferenceModes.NORMAL);
        } else {
          setConferenceMode(ConferenceModes.CONTROL);
        }
      }
    }
  };

  const handelProfieBackButton = () => {
    setBottomPopup({
      ...bottomPopup,
      contentList: userList,
      title: t('참석자 리스트'),
      popupType: 'USERLIST'
    });
    setIsPopupTouch(false);
  };

  const handleEmail = () => {
    Linking.openURL(
      `mailto:?subject=&body=https://video.wehago.com/video?room%3D${roomId}`
    );
  };

  const handleSms = () => {
    const Divider: string = isIOS ? '&' : '?';
    Linking.openURL(
      `sms:${Divider}body=https://video.wehago.com/video?room=${roomId}`
    );
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        title: '링크 공유',
        message: `https://video.wehago.com/video?room=${roomId}`
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.warn(error);
    }
  };

  const handleLinkCopy = () => {
    Clipboard.setString(`https://video.wehago.com/video?room=${roomId}`);
    //다국어 필요
    setToastMessage(t('공유링크가 복사되었습니다.'));
  };

  const handleJoincodeCopy = async () => {
    let joincode;
    const getJoincode = await MeetApi.getJoincode(auth, roomId);
    if (isSuccess(getJoincode)) {
      joincode = getJoincode.resultData;
      Clipboard.setString(joincode);
      //다국어 필요
      setToastMessage(t('참여코드가 복사되었습니다.'));
    } else {
      console.warn('3-46 getJoincode : ', getJoincode.errors);
    }
  };

  const handdlePersonPlus = () => {
    const organization = {
      icon1: icOrganizationW,
      name: t('조직도로 초대하기'),
      onClick: () => {}
    };
    const email = {
      icon1: icMailW,
      name: t('이메일로 초대하기'),
      onClick: () => handleEmail()
    };
    const phone = {
      icon1: icPhoneW,
      name: t('SMS로 초대하기'),
      onClick: () => handleSms()
    };
    const share = {
      icon1: icShareW,
      name: t('공유하기'),
      onClick: () => handleShare()
    };
    const link = {
      icon1: icLinkW,
      name: t('공유링크 복사하기'),
      onClick: () => handleLinkCopy()
    };
    const code = {
      icon1: icCodeW,
      name: t('참여코드 복사하기'),
      onClick: () => handleJoincodeCopy()
    };

    setBottomPopup({
      contentList: [email, phone, share, link, code],
      show: true,
      title: t('참석자 초대'),
      popupType: 'NORMAL'
    });
  };

  const _handleReverseVideo = _.throttle(() => {
    setIsVideoReverse(!isVideoReverse);
  }, 1000);

  const _handleChangeSpeaker = () => {
    setSpeaker(speaker === 2 ? 1 : 2);

    if (isIOS) {
      InCallManager.stop();
      if (speaker === 2) {
        InCallManager.setSpeakerphoneOn(true);
        InCallManager.setForceSpeakerphoneOn(true);
      } else {
        InCallManager.setSpeakerphoneOn(false);
        InCallManager.setForceSpeakerphoneOn(false);
      }
    } else {
      // android
      if (speaker === 2) {
        InCallManager.setSpeakerphoneOn(true);
        InCallManager.chooseAudioRoute('SPEAKER_PHONE');
      } else {
        InCallManager.setSpeakerphoneOn(false);
        InCallManager.chooseAudioRoute('BLUETOOTH');
      }
    }
  };

  const _updateRolefromMaster = (newMaster: string) => {
    let conferenceManager = getConferenceManager();
    let newMasters: string[] = [];
    let unMasters: string[] = [];

    const cancel = masters.find(master => master === newMaster);
    cancel && unMasters.push(cancel);

    if (cancel) {
      newMasters = masters.filter(master => master !== newMaster);
    } else {
      newMasters = masters;
      newMasters.push(newMaster);
    }

    const params: { master: string[]; unmaster: string[] } = {
      master: newMasters,
      unmaster: unMasters
    };

    MeetApi.setMasterList(auth, roomId, params);
    conferenceManager.updateRolefromMaster(newMaster, cancel);
  };

  const _micControlFromMaster = () => {
    let conferenceManager = getConferenceManager();
    conferenceManager.micControlFromMaster(!micControlMode);
    setIsMicControlMode(!micControlMode);
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
      handelProfieBackButton={handelProfieBackButton}
      setIsPopupTouch={setIsPopupTouch}
      limitedTime={limitedTime}
      setLimitedTime={setLimitedTime}
      handdlePersonPlus={handdlePersonPlus}
      updateRolefromMaster={_updateRolefromMaster}
      handleMicControlFromMaster={_micControlFromMaster}
    />
  );
}

export default ContentContainer;
