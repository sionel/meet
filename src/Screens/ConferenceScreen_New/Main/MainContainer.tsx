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
    isMuteVideo,
    isLocal,
    presenter,
    attributes,
    documentListMode
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
    isMuteVideo: state.mainUser_copy.isMuteVideo,
    isLocal: state.mainUser_copy.isLocal,
    presenter: state.documentShare.presenter,
    attributes: state.documentShare.attributes,
    documentListMode: state.documentShare.documentListMode
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

  const toggleScreenFlag = () => {
    dispatch(ScreenShareActions.toggleScreenFlag());
  };

  const setMainUser = (jitsiId: string) => {
    dispatch(MainuserActions.setMainUser(jitsiId));
  };

  const toggleMuteVideo = (isMute: boolean) => {
    dispatch(MainuserActions.toggleMuteVideo(isMute));
  };
  //#endregion dispatch

  useEffect(() => {
    setMainUserMaster();
  }, [mainUser.jitsiId]);

  useEffect(() => {
    if (presenter === '') {
      if (isMuteVideo) {
        setMainView('character');
      } else {
        setMainView('track');
      }
    }
  }, [isMuteVideo]);

  useEffect(() => {
    if (documentListMode) {
      setMainView('document');
    } else {
      if (isMuteVideo) {
        setMainView('character');
      } else {
        setMainView('track');
      }
    }
  }, [documentListMode]);

  //TODO: 추후에 스플릿비디오에서 메인화면 지정시 카메라 ON/OFF 잘되는지 확인 !
  useEffect(() => {
    if (!isLocal) {
      let isMute;
      isMute = mainVideoTrack && mainVideoTrack.isMuted();
      toggleMuteVideo(!isMute);
    }
  }, [mainVideoTrack.isMuted()]);

  useEffect(() => {
    const myId = room?.getMyId();
    if (presenter !== '') {
      if (presenter !== 'localUser') {
        setMainUser(presenter);
      } else {
        setMainUser(myId);
      }

      if (typeof attributes === 'boolean') {
        attributes && setMainView('sketch');
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
