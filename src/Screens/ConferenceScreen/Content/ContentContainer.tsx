import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  GestureResponderEvent,
  NativeModules,
  NativeTouchEvent,
  Platform,
  Share
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

import icOrganizationW from '@assets/icons/ic_organization_w.png';
import icMailW from '@assets/icons/ic_mail_w.png';
import icPhoneW from '@assets/icons/ic_phone_w.png';
import icShareW from '@assets/icons/ic_share_w.png';
import icLinkW from '@assets/icons/ic_link_w.png';
import icCodeW from '@assets/icons/ic_code.png';

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

  const [bottomPopup, setBottomPopup] = useState<ConferenceBottomPopupProps>({
    show: false,
    contentList: [],
    title: '',
    popupType: 'NORMAL'
  });
  const [isPopupTouch, setIsPopupTouch] = useState(false);

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
    expireTime,
    isLogin,
    isScreenShare
  } = useSelector((state: RootState) => {
    const { local, mainUser, documentShare, root, user, participants, master, screenShare } =
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
      isLogin: user.isLogin,
      participants: participants.list,
      masters: master.masterList,
      isScreenShare: screenShare.isScreenShare,
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

  // if(auth === '{}')

  // console.log(user);
  
  
  if(auth.portal_id) {
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
        isMobile: true
      }
    });
  } else {
    userList.unshift({
      ...user,
      userInfo: {
        userName: user.name,
        isMobile: true,
        isExternalParticipant: `${!isLogin}`,
      }
    });
  }

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
    isMultipleView && setConferenceMode(ConferenceModes.CONTROL);
  }, [isMultipleView]);

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
      title: t('참석자리스트'),
      popupType: 'USERLIST'
    });
    setIsPopupTouch(false);
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        url: 'https://www.google.com'
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

  const onSms = async () => {
    try {
      const result = await Share.share(
        {
          message: 'https://www.google.com'
        },
        {
          excludedActivityTypes: [
            'com.apple.UIKit.activity.PostToFacebook',
            'com.apple.UIKit.activity.PostToTwitter',
            'com.apple.UIKit.activity.Mail',
            'com.apple.UIKit.activity.Print',
            'com.apple.UIKit.activity.CopyToPasteboard',
            'com.apple.UIKit.activity.AssignToContact',
            'com.apple.UIKit.activity.SaveToCameraRoll',
            'com.apple.UIKit.activity.AddToReadingList',
            'com.apple.UIKit.activity.PostToFlickr',
            'com.apple.UIKit.activity.PostToVimeo',
            'com.apple.UIKit.activity.PostToTencentWeibo',
            'com.apple.UIKit.activity.AirDrop',
            'com.apple.UIKit.activity.OpenInIBooks',
            'com.apple.UIKit.activity.MarkupAsPDF',
            'com.apple.reminders.RemindersEditorExtension', //Reminders
            'com.apple.mobilenotes.SharingExtension', // Notes
            'com.apple.mobileslideshow.StreamShareService'
          ]
        }
      );

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

  const handdlePersonPlus = () => {
    const organization = {
      icon1: icOrganizationW,
      name: t('조직도로 초대하기'),
      onClick: () => {}
    };
    const email = {
      icon1: icMailW,
      name: t('이메일로 초대하기'),
      onClick: () => {}
    };
    const phone = {
      icon1: icPhoneW,
      name: t('SMS로 초대하기'),
      onClick: () => onSms()
    };
    const share = {
      icon1: icShareW,
      name: t('공유하기'),
      onClick: () => onShare()
    };
    const link = {
      icon1: icLinkW,
      name: t('공유링크 복사하기'),
      onClick: () => {}
    };
    const code = {
      icon1: icCodeW,
      name: t('참여코드 복사하기'),
      onClick: () => {}
    };

    setBottomPopup({
      contentList: [organization, email, phone, share, link, code],
      show: true,
      title: t('참석자 초대'),
      popupType: 'NORMAL'
    });
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
      handdlePersonPlus={handdlePersonPlus}
    />
  );
}

export default ContentContainer;
