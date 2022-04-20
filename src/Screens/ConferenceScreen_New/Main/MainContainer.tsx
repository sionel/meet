import React, { useEffect, useState } from 'react';
import MainVideoPresenter from './MainPresenter';
import { MainContainerProps } from '@screens/ConferenceScreen_New/types';

import { actionCreators as ConferenceActions } from '@redux/conference';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/configureStore';

const MainContainer: React.FC<MainContainerProps> = ({ mainUser }) => {
  const [isScreenShare, setIsScreenShare] = useState(false);
  const _handlePressShareStop = () => {
    setIsScreenShare(false);
  };

  //#region selector
  const { mainDisplayType } = useSelector((state: RootState) => ({
    mainDisplayType: state.conference.mainDisplayType
  }));
  //#endregion selector

  //#region dispatch
  const dispatch = useDispatch();
  const setMainDisplayType = (
    displayType:
      | 'CHARACTER'
      | 'RTCVIEW'
      | 'SCREENSHARE'
      | 'DOCUMENTSHARE'
      | 'SKETCH'
  ) => dispatch(ConferenceActions.setMainDisplayType(displayType));
  //#endregion dispatch

  useEffect(() => {
    if (isScreenShare) {
      setMainDisplayType('SCREENSHARE');
    } else if (mainUser?.videoTrack) {
      setMainDisplayType('RTCVIEW');
    } else {
      setMainDisplayType('CHARACTER');
    }

    return () => {
      setMainDisplayType('CHARACTER');
    };
  }, [mainDisplayType]);

  return (
    <MainVideoPresenter
      displayType={mainDisplayType}
      // RTCView, Character
      isMaster={true}
      userName={'김연길'}
      // Character
      avartar={'jessie'}
      // RTCView
      videoType={mainUser?.videoTrack?.videoType}
      streamURL={mainUser?.videoTrack?.getOriginalStream().toURL()}
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
