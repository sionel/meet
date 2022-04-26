import React, { useEffect, useState } from 'react';
import MainVideoPresenter from './MainPresenter';
import { MainContainerProps } from '@screens/ConferenceScreen_New/types';

import { actionCreators as ConferenceActions } from '@redux/conference';
import { actionCreators as MainuserActions } from '@redux/mainUser_copy';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/configureStore';

const MainContainer: React.FC<MainContainerProps> = ({}) => {
  const [isScreenShare, setIsScreenShare] = useState(false);
  const _handlePressShareStop = () => {
    setIsScreenShare(false);
  };

  //#region selector
  const {
    mainDisplayType,
    topDisplayType,
    bottomDisplayType,
    mirrorMode,
    masters,
    mainUser
  } = useSelector((state: RootState) => ({
    mainUser: state.mainUser_copy,
    mainDisplayType: state.mainUser_copy.mode,
    masters: state.master.masterList,
    topDisplayType: state.conference.topDisplayType,
    bottomDisplayType: state.conference.bottomDisplayType,
    mirrorMode: state.conference.mirrorMode
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
      // TODO: 이거 합쳐서 생각해야하는데..
      // isScreenShare={isScreenShare}
      // isStream={false}
      // isMuteVideo={mainUser?.videoTrack?.muted}
      // presenter={false}
    />
  );
};
export default MainContainer;
