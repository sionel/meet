import React, { useEffect, useState } from 'react';
import MainVideoPresenter from './MainPresenter';
import { MainContainerProps } from '@screens/ConferenceScreen_New/types';

import { actionCreators as ConferenceActions } from '@redux/conference';
import { actionCreators as MainuserActions } from '@redux/mainUser_copy';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/configureStore';

const MainContainer: React.FC<MainContainerProps> = ({}) => {
  // const [isScreenShare, setIsScreenShare] = useState(false);

  //#region selector
  const {
    mainDisplayType,
    topDisplayType,
    bottomDisplayType,
    mirrorMode,
    masters,
    mainUser,
    isScreenShare
  } = useSelector((state: RootState) => ({
    mainUser: state.mainUser_copy,
    mainDisplayType: state.mainUser_copy.mode,
    masters: state.master.masterList,
    topDisplayType: state.conference.topDisplayType,
    bottomDisplayType: state.conference.bottomDisplayType,
    mirrorMode: state.conference.mirrorMode,
    isScreenShare: state.screenShare.isScreenShare
  }));
  //#endregion selector

  // console.log('mainDisplayType : ', mainDisplayType);

  //#region dispatch
  const dispatch = useDispatch();

  const handleTopDisplay = () => {
    let top = topDisplayType;
    let bot = bottomDisplayType;
    if (bot !== 'NONE') {
      dispatch(ConferenceActions.setBottomDisplayType('NONE'));
    } else {
      if (top === 'FUNCTION') {
        top = 'NAME';
      } else {
        top = 'FUNCTION';
      }
      dispatch(ConferenceActions.setTopDisplayType(top));
    }
  };

  const setMainUserMaster = () =>
    dispatch(MainuserActions.updateMainUserIsMaster());

  const setMainView = (
    mode: 'track' | 'sketch' | 'document' | 'screen' | 'character'
  ) => dispatch(MainuserActions.setMainView(mode));

  // const toggleScreenFlag = () => dispatch(ScreenShareAction.toggleScreenFlag());
  //#endregion dispatch

  // useEffect(() => {
  //   if (isScreenShare) {
  //     // setMainDisplayType('SCREENSHARE');
  //   } else if (!mainUser.videoTrack.isMuted()) {
  //     // setMainDisplayType('RTCVIEW');
  //   } else {
  //     // setMainDisplayType('CHARACTER');
  //   }

  //   return () => {
  //     // setMainDisplayType('CHARACTER');
  //   };
  // }, [mainDisplayType]);

  useEffect(() => {
    setMainUserMaster();
    return () => {};
  }, [masters]);

  const _handlePressShareStop = () => {
    setMainView('track');
  };

  const userName = mainUser.nickname
    ? `${mainUser.name} (${mainUser.nickname})`
    : `${mainUser.name}`;

  return (
    <MainVideoPresenter
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
      isScreenShare={isScreenShare}
    />
  );
};
export default MainContainer;
