import React, { useState } from 'react';
import MainVideoPresenter from './MainVideoPresenter';
import { MainVideoContainerProps } from '../types';

const MainVideoContainer: React.FC<MainVideoContainerProps> = ({ insets }) => {
  const [isScreenShare, setIsScreenShare] = useState(false);
  const onPressShareStop = () => {
    setIsScreenShare(false);
  };

  return (
    <MainVideoPresenter
      insets={insets}
      character={'jessie'}
      presenter={false}
      isScreenShare={isScreenShare}
      isMuteVideo={true}
      stream={false}
      onPressShareStop={onPressShareStop}
    />
  );
};
export default MainVideoContainer;
