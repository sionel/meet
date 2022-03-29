import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actionCreators as localAction } from '@redux/local';
import { actionCreators as mainUserAction } from '@redux/mainUser';
import { actionCreators as ScreenShareAction } from '@redux/ScreenShare';
import { RootState } from 'src/redux/configureStore';
import TopAreaPresenter from './TopAreaPresenter';
import { GestureResponderEvent, Platform } from 'react-native';
import { ConferenceBottomPopupProps } from '../../ContentContainer';
import _ from 'underscore';
import { getT } from '@utils/translateManager';

import icDocument from '@assets/icons/ic_document.png';
import icHand from '@assets/icons/ic_hand.png';
import icRecord from '@assets/icons/ic_record.png';
import icSketch from '@assets/icons/ic_sketch.png';
import icWrite from '@assets/icons/ic_write.png';
import icoScreenShagre from '@oldassets/icons/icoScreenShagre.png';
import { ParticipantsTypes } from '@redux/participants';
import deviceInfoModule from 'react-native-device-info';

type TopAreaContainerProps = {
  callType: number;
  onReverseVideo: () => void;
  onChangeDrawing: () => void;
  onChangeDrawingMode: (value: any) => void;
  mainUser: any;
  elapsedTime: number;
  handleBottomPopup: React.Dispatch<
    React.SetStateAction<ConferenceBottomPopupProps>
  >;
  bottomPopup: ConferenceBottomPopupProps;
  userList: ParticipantsTypes[];
  isMultipleView: boolean;
  setIsMultipleView: () => void;
  selectedRoomName: string;
  handleMicControlFromMaster: () => void;
};

const isPad = deviceInfoModule.isTablet();

const TopAreaContainer = (props: TopAreaContainerProps) => {
  const t = getT();
  const [isControlMode, setIsControlMode] = useState(false);
  const [isMainUserMaster, setIsMainUserMaster] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const {
    callType,
    mainUser,
    elapsedTime,
    bottomPopup,
    handleBottomPopup,
    userList,
    isMultipleView,
    selectedRoomName,
    onChangeDrawingMode,
    handleMicControlFromMaster
  } = props;

  //start selector
  const {
    conferenceMode,
    deployedServices,
    isScreenShare,
    isHorizon,
    expireTime,
    message,
    masters,
    auth
  } = useSelector((state: RootState) => {
    const {
      local,
      root,
      user,
      deployed,
      screenShare,
      orientation,
      participants,
      master
    } = state;
    return {
      conferenceMode: local.conferenceMode,
      user: local.user,
      expireTime: local.expireTime,
      participants: participants.list,
      videoPolicy: root.videoPolicy,
      loginType: user.loginType,
      memberType: user.auth.member_type,
      auth: user.auth,
      deployedServices: deployed.deployedServices,
      isScreenShare: screenShare.isScreenShare,
      isHorizon: orientation.isHorizon,
      masters: master.masterList,
      message: local.message
    };
  });
  //end selector

  //start dispatch
  const dispatch = useDispatch();
  const toggleCameraFacingMode = () =>
    dispatch(localAction.toggleCameraFacingMode());
  const toggleDocumentListMode = (documentListMode: string[]) =>
    dispatch(mainUserAction.setDocumentListMode(documentListMode));
  const toggleScreenFlag = () => dispatch(ScreenShareAction.toggleScreenFlag());
  //end dispatch

  const talkButton = callType === 3;
  const penButton = true;
  const docShareButton = !expireTime && deployedServices.includes('wedrive');
  const screenShareButton = Platform.OS === 'ios' ? !isPad : true;
  const switchButton = !isScreenShare;
  const reverseButton = !isScreenShare;
  const isMaster = masters.find(master => master === auth.portal_id);

  useEffect(() => {
    userList.find(v => {
      if (v.id === mainUser.id) {
        v.isMaster === true
          ? setIsMainUserMaster(true)
          : setIsMainUserMaster(false);
      }
    });
  }, [mainUser.id]);

  useEffect(() => {
    let count = 0;
    message.forEach(list => {
      if (!list.isRead) {
        count = count + 1;
      }
    });
    if (bottomPopup.popupType === 'CHATTING') {
      count = count - 1;
    }
    setMessageCount(count);
  }, [message.length]);

  const onExitPopup = () => {
    handleBottomPopup({
      ...bottomPopup,
      show: false
    });
  };

  useEffect(() => {
    bottomPopup.show &&
      handleBottomPopup({
        ...bottomPopup,
        contentList: userList
      });
    return () => {};
  }, [masters.length]);

  const handdleUserListClick = (e: GestureResponderEvent) => {
    if (bottomPopup.show) {
      onExitPopup();
    } else {
      handleBottomPopup({
        contentList: userList,
        show: true,
        title: t('참석자 리스트'),
        popupType: 'USERLIST'
      });
    }
  };

  const handdleChattingClick = () => {
    if (bottomPopup.show) {
      handleBottomPopup({
        ...bottomPopup,
        popupType: 'NORMAL',
        show: false
      });
    } else {
      handleBottomPopup({
        contentList: [],
        show: true,
        title: t(''),
        popupType: 'CHATTING'
      });
      setMessageCount(0);
    }
  };

  const handdleMoreClick = () => {
    if (bottomPopup.show) {
      onExitPopup();
    } else {
      const sketch = penButton
        ? {
            icon1: icSketch,
            name: t('스케치'),
            onClick: () => onChangeDrawingMode(true)
          }
        : undefined;
      const document = docShareButton ? {
        icon1: icDocument,
        name: t('문서공유'),
        onClick: () => toggleDocumentListMode(['FILELIST'])
      } : undefined;
      const share = screenShareButton ? {
        icon1: icoScreenShagre,
        name: t('화면공유'),
        onClick: () => toggleScreenFlag()
      } : undefined;
      const hand = isMaster
        ? {
            icon1: icHand,
            name: !isControlMode ? t('발언권 시작') : t('발언권 종료'),
            onClick: () => {
              handleMicControlFromMaster();
              setIsControlMode(!isControlMode);
            }
          }
        : undefined;

      //TODO: 기능 미구현
      // const record = {
      //   icon1: icRecord,
      //   name: t('회의녹화'),
      //   onClick: () => {}
      // };
      // const write = {
      //   icon1: icWrite,
      //   name: t('자동 회의록'),
      //   onClick: () => {}
      // };

      const popupList = [sketch, document, share, hand];
      const filterList = popupList.filter(popup => popup !== undefined);
      handleBottomPopup({
        contentList: filterList,
        show: true,
        title: t('더보기'),
        popupType: 'NORMAL'
      });
    }
  };

  const second2String = (second: number) => {
    let hours: any = Math.floor(second / 3600);
    let minutes: any = Math.floor((second - hours * 3600) / 60);
    let seconds: any = Math.floor(second - hours * 3600 - minutes * 60);

    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    return hours + ':' + minutes + ':' + seconds;
  };

  let time = second2String(elapsedTime);

  return (
    <TopAreaPresenter
      talkButton={talkButton}
      switchButton={switchButton}
      reverseButton={reverseButton}
      toggleCameraFacingMode={toggleCameraFacingMode}
      onReverseVideo={props.onReverseVideo}
      mainUser={mainUser}
      elapsedTime={time}
      isMaster={isMainUserMaster}
      handdleMoreClick={handdleMoreClick}
      isMultipleView={isMultipleView}
      selectedRoomName={selectedRoomName}
      handdleUserListClick={handdleUserListClick}
      handdleChattingClick={handdleChattingClick}
      messageCount={messageCount}
      isHorizon={isHorizon}
    />
  );
};

export default TopAreaContainer;
