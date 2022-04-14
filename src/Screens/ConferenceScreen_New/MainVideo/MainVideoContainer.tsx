import { View, Text } from 'react-native';
import React, { useState } from 'react';
import MainVideoPresenter from './MainVideoPresenter';
import { MainVideoContainerProps } from '../types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MainVideoContainer: React.FC<MainVideoContainerProps> = () => {
  const [isScreenShare, setIsScreenShare] = useState(true);
  const insets = useSafeAreaInsets();
  const onPressShareStop = () => {
    setIsScreenShare(false);
  }

  return (
    <MainVideoPresenter
      character={'jessie'}
      presenter={false}
      isScreenShare={isScreenShare}
      isMuteVideo={true}
      stream={false}
      insets={insets}
      onPressShareStop={onPressShareStop}
    />
  );
};
export default MainVideoContainer;
