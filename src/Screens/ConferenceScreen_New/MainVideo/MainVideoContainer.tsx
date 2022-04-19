import React, { useState } from 'react';
import MainVideoPresenter from './MainVideoPresenter';
import { MainVideoContainerProps } from '../types';

const MainVideoContainer: React.FC<MainVideoContainerProps> = ({
  mainUser
}) => {
  const [isScreenShare, setIsScreenShare] = useState(false);
  const onPressShareStop = () => {
    setIsScreenShare(false);
  };

  console.log('videoType : ', mainUser?.videoTrack?.videoType);
  
  return (
    <MainVideoPresenter
      character={'jessie'}
      presenter={false}
      isScreenShare={isScreenShare}
      isMuteVideo={mainUser?.videoTrack?.muted}
      stream={mainUser?.videoTrack?.getOriginalStream()}
      videoType={mainUser?.videoTrack?.videoType}
      mainUser={mainUser}
      onPressShareStop={onPressShareStop}
    />
  );
};
export default MainVideoContainer;
