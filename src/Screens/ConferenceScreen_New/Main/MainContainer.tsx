import React, { useEffect, useState } from 'react';
import MainPresenter from './MainPresenter';
import { MainContainerProps } from '@screens/ConferenceScreen_New/types';

import { actionCreators as ConferenceActions } from '@redux/conference';
import { actionCreators as MainuserActions } from '@redux/mainUser_copy';
import { actionCreators as ScreenShareActions } from '@redux/ScreenShare';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/configureStore';
import { Alert } from 'react-native';
import { getT } from '@utils/translateManager';

const MainContainer: React.FC<MainContainerProps> = ({ roomName }) => {
  const t = getT();
  //#region selector
  const {
    mainDisplayType,
    topDisplayType,
    bottomDisplayType,
    mirrorMode,
    masters,
    mainUser,
    // isScreenShare,
    room,
    mainVideoTrack,
    localVideoTrack
  } = useSelector((state: RootState) => ({
    mainUser: state.mainUser_copy,
    mainDisplayType: state.mainUser_copy.mode,
    masters: state.master.masterList,
    topDisplayType: state.conference.topDisplayType,
    bottomDisplayType: state.conference.bottomDisplayType,
    mirrorMode: state.conference.mirrorMode,
    // isScreenShare: state.screenShare.isScreenShare,
    room: state.conference.room,
    mainVideoTrack: state.mainUser_copy.videoTrack,
    localVideoTrack: state.conference.videoState
  }));
  //#endregion selector

  // 메인컨테이너 말고 필요한 스케치나, 파일공유에서 처리
  // const [isMikeOn, setIsMikeOn] = useState(!mikeState.isMuted());

  //#region dispatch
  const dispatch = useDispatch();

  const setTopDisplayType = (displayType: 'FUNCTION' | 'NAME') =>
    dispatch(ConferenceActions.setTopDisplayType(displayType));

  const setMainView = (
    mode: 'track' | 'sketch' | 'document' | 'screen' | 'character'
  ) => dispatch(MainuserActions.setMainView(mode));

  const setBotDisplayType = (
    displayType: 'MENU' | 'CHATTING' | 'PARTICIPANTS' | 'NONE'
  ) => dispatch(ConferenceActions.setBottomDisplayType(displayType));

  const setMainUserMaster = () =>
    dispatch(MainuserActions.updateMainUserIsMaster());

  const toggleScreenFlag = () =>
    dispatch(ScreenShareActions.toggleScreenFlag());

  const setMainuser = (jitsiId: string) =>
    dispatch(MainuserActions.setMainUser(jitsiId));
  //#endregion dispatch

  const [isVideoOn, setIsVideoOn] = useState(!mainVideoTrack.isMuted());

    useEffect(() => {
    setIsVideoOn(!mainVideoTrack.isMuted());
    console.log('mainVideoTrack.track.muted : ', mainVideoTrack);
    
  }, [localVideoTrack.isMuted()])
  // useEffect(() => {
  //   console.log('mainVideoTrack.track.muted : ', mainVideoTrack.track.muted);
  //   console.log('localVideoTrack.track.muted : ', localVideoTrack.track.muted);

  //   console.log('mainUser.isLocal : ', mainUser.isLocal);

  //   if (mainUser.isLocal) {
  //     setIsVideoOn(!localVideoTrack.isMuted());
  //   } else {
  //     setIsVideoOn(!mainVideoTrack.isMuted());
  //   }

  //   // console.log('isVideoOn : ', isVideoOn);

  //   if (isVideoOn) {
  //     setMainView('track');
      
  //   } else {
  //     setMainView('character');
  //   }
  // }, [localVideoTrack.track.muted]);


  // useEffect(() => {
  //   setMainUserMaster();
  //   return () => {};
  // }, [masters]);

  // useEffect(() => {
  //   // console.log('presenter : ', presenter);
  //   if (presenter !== '') {
  //     setMainuser(presenter);
  //     setMainUserMaster();
  //   } else {
  //     if (!mainUser.isLocal) {
  //       if (!mainUser.videoTrack.isMuted()) {
  //         setMainView('character');
  //       } else {
  //         setMainView('track');
  //       }
  //     }
  //   }
  // }, [presenter]);

  // useEffect(() => {
  //   if (!mainUser.isLocal) {
  //     if (!mainUser.videoTrack.isMuted()) {
  //       setMainView('character');
  //     } else {
  //       setMainView('track');
  //     }
  //   }
  // }, [mainUser.videoTrack.isMuted()]);

  const _handlePressShareStop = () => {
    toggleScreenFlag();
  };

  const handleTopDisplay = () => {
    let top = topDisplayType;
    let bot = bottomDisplayType;
    if (bot !== 'NONE') {
      setBotDisplayType('NONE');
    } else {
      if (top === 'FUNCTION') {
        top = 'NAME';
      } else {
        top = 'FUNCTION';
      }
      setTopDisplayType(top);
    }
  };

  // const _handlePressExit = () => {
  //   const MODE =
  //     mainDisplayType === 'sketch' ? t('meet_sketch') : t('meet_share');
  //   const title = t('alert_title_mode_exit').replace('[@mode@]', MODE);
  //   const text = t('alert_text_quit')
  //     .replace('[@mode@]', MODE)
  //     .replace('[@mode@]', MODE);
  //   const handleConfirm = () => {
  //     // TODO: 스케치모드 종료하는 함수 추가
  //     let isVideoOn = !videoState.isMuted();
  //     room && room.sendMessage.setDrawingData();
  //     room && room.sendMessage.setDrawingShareMode(false);
  //     if (isVideoOn) {
  //       setMainView('track');
  //     } else {
  //       setMainView('character');
  //     }
  //   };
  //   Alert.alert(title, text, [
  //     {
  //       text: t('alert_button_cancel'),
  //       onPress: () => {}
  //     },
  //     {
  //       text: t('alert_button_confirm'),
  //       onPress: () => handleConfirm()
  //     }
  //   ]);
  // };

  // Sketch, document 안에 넣어서 함수 제공
  // const _handlePressMike = () => {
  //   if (isMikeOn) {
  //     mikeState.mute();
  //   } else {
  //     mikeState.unmute();
  //   }
  //   setIsMikeOn(!isMikeOn);
  // };

  const userName = mainUser.nickname
    ? `${mainUser.nickname}(${mainUser.name})`
    : `${mainUser.name}`;

  return (
    <MainPresenter
      displayType={mainDisplayType}
      onPressMainView={handleTopDisplay}
      // RTCView, Character
      isMaster={mainUser.isMaster}
      userName={userName}
      // Character
      avatar={mainUser.avatar}
      // RTCView
      videoType={mainUser?.videoTrack?.videoType}
      streamURL={mainUser?.videoTrack?.getOriginalStream().toURL()}
      mirrorMode={mirrorMode}
      // ScreenShare
      onPressShareStop={_handlePressShareStop}
      // Sketch, Document
      roomName={roomName}
    />
  );
};
export default MainContainer;
