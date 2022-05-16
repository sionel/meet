import React, { useEffect, useState } from 'react';
import MainPresenter from './MainPresenter';
import { MainContainerProps } from '@screens/ConferenceScreen/types';

import { actionCreators as ConferenceActions } from '@redux/conference';
import { actionCreators as MainuserActions } from '@redux/mainUser_copy';
import { actionCreators as ScreenShareActions } from '@redux/ScreenShare';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/configureStore';
import { Alert, Platform } from 'react-native';
import { getT } from '@utils/translateManager';

const MainContainer: React.FC<MainContainerProps> = ({ roomName, onClose }) => {
  //#region selector
  const {
    mainDisplayType,
    topDisplayType,
    bottomDisplayType,
    mirrorMode,
    masterList,
    mainUser,
    isScreenShare,
    room,
    mainVideoTrack,
    isMuteVideo,
    isLocal,
    presenter,
    attributes,
    myVideoState
  } = useSelector((state: RootState) => ({
    mainUser: state.mainUser_copy,
    mainDisplayType: state.mainUser_copy.mode,
    masterList: state.master.masterList,
    topDisplayType: state.conference.topDisplayType,
    bottomDisplayType: state.conference.bottomDisplayType,
    mirrorMode: state.conference.mirrorMode,
    isScreenShare: state.screenShare.isScreenShare,
    room: state.conference.room,
    mainVideoTrack: state.mainUser_copy.videoTrack,
    isMuteVideo: state.mainUser_copy.isMuteVideo,
    isLocal: state.mainUser_copy.isLocal,
    presenter: state.documentShare.presenter,
    attributes: state.documentShare.attributes,
    myVideoState: state.conference.videoState
  }));
  //#endregion selector

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

  const setMainUserMaster = () => {
    dispatch(MainuserActions.updateMainUserIsMaster());
  };

  const setMainUser = (jitsiId: string) => {
    dispatch(MainuserActions.setMainUser(jitsiId));
  };

  const toggleMuteVideo = (isMute: boolean) => {
    dispatch(MainuserActions.toggleMuteVideo(isMute));
  };

  const setScreenFlag = (flag: boolean) => {
    dispatch(ScreenShareActions.setScreenFlag(flag));
  };

  const toggleScreenFlag = () => {
    dispatch(ScreenShareActions.toggleScreenFlag());
  };

  const updateMainUserIsMaster = () => {
    dispatch(MainuserActions.updateMainUserIsMaster());
  };
  //#endregion dispatch

  useEffect(() => {
    // 메인유저가 변경될때마다 마스터 여부체크
    setMainUserMaster();
  }, [mainUser.jitsiId]);

  useEffect(() => {
    // 내가 메인유저일때 화면전환 처리
    if (presenter === '') {
      if (isMuteVideo) {
        setMainView('character');
      } else {
        setMainView('track');
      }
    }
  }, [isMuteVideo]);

  useEffect(() => {
    //TODO: 추후에 스플릿비디오에서 메인화면 지정시 카메라 ON/OFF 잘되는지 확인 !
    if (!isLocal && presenter === '') {
      let isMute;
      isMute = mainVideoTrack ? mainVideoTrack.isMuted() : true;
      toggleMuteVideo(!isMute);
    }
  }, [mainVideoTrack?.isMuted()]);

  useEffect(() => {
    // 스케치, 문서공유모드 화면전환 처리
    const myId = room?.getMyId();
    if (presenter !== '') {
      if (presenter !== 'localUser') {
        setMainUser(presenter);
      } else {
        setMainUser(myId);
      }

      if (typeof attributes === 'boolean') {
        attributes && setMainView('sketch');
      } else {
        attributes && setMainView('document');
      }
    } else {
      setMainUser(myId);
      if (isMuteVideo) {
        setMainView('character');
      } else {
        setMainView('track');
      }
    }
  }, [presenter]);

  useEffect(() => {
    // 화면공유시 화면전환 처리
    if (isScreenShare) {
      setMainView('screen');
    } else {
      if (isMuteVideo) {
        setMainView('character');
      } else {
        setMainView('track');
      }
    }
  }, [isScreenShare]);

  useEffect(() => {
    // 회의 진행중 마스터 변경에 대한 처리
    updateMainUserIsMaster();
  }, [masterList.length]);

  const _handlePressShareStop = () => {
    if (Platform.OS === 'android') {
      try {
        room && room.changeTrack('video', myVideoState);
        setScreenFlag(false);
        toggleMuteVideo(true);
        setTimeout(() => {
          toggleMuteVideo(false);
        }, 500);
      } catch (error) {
        console.log('error : ', error);
        setScreenFlag(false);
      }
    } else {
      toggleScreenFlag();
    }
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
      onClose={onClose}
    />
  );
};
export default MainContainer;
