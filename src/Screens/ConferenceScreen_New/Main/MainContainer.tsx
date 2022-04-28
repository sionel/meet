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
    isScreenShare,
    mikeState,
    videoState
  } = useSelector((state: RootState) => ({
    mainUser: state.mainUser_copy,
    mainDisplayType: state.mainUser_copy.mode,
    masters: state.master.masterList,
    topDisplayType: state.conference.topDisplayType,
    bottomDisplayType: state.conference.bottomDisplayType,
    mirrorMode: state.conference.mirrorMode,
    isScreenShare: state.screenShare.isScreenShare,
    mikeState: state.conference.mikeState,
    videoState: state.conference.videoState
  }));
  //#endregion selector

  const [isMikeOn, setIsMikeOn] = useState(!mikeState.isMuted());

  // console.log('mainDisplayType : ', mainDisplayType);

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
  //#endregion dispatch

  useEffect(() => {
    setMainUserMaster();
    return () => {};
  }, [masters]);

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

  const _onPressExit = () => {
    const MODE =
      mainDisplayType === 'sketch' ? t('meet_sketch') : t('meet_share');
    const title = t('alert_title_mode_exit').replace('[@mode@]', MODE);
    const text = t('alert_text_quit')
      .replace('[@mode@]', MODE)
      .replace('[@mode@]', MODE);
    const handleConfirm = () => {
      // TODO: 스케치모드 종료하는 함수 추가
      let isVideoOn = !videoState.isMuted();
      if (isVideoOn) {
        setMainView('track');
      } else {
        setMainView('character');
      }
    };
    Alert.alert(title, text, [
      {
        text: t('alert_button_cancel'),
        onPress: () => {}
      },
      {
        text: t('alert_button_confirm'),
        onPress: () => handleConfirm()
      }
    ]);
  };

  const _onPressMike = () => {
    if (isMikeOn) {
      mikeState.mute();
    } else {
      mikeState.unmute();
    }
    setIsMikeOn(!isMikeOn);
  };

  const userName = mainUser.nickname
    ? `${mainUser.name} (${mainUser.nickname})`
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
      // Sketch
      isMikeOn={isMikeOn}
      roomName={roomName}
      onPressExit={_onPressExit}
      onPressMike={_onPressMike}
    />
  );
};
export default MainContainer;
