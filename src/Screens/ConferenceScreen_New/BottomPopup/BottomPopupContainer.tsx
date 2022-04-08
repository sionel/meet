import { View, Text } from 'react-native';
import React from 'react';
import { BottomPopupContainerProps } from '../types';
import BottomPopupPresenter from './BottomPopupPresenter';

const BottomPopupContainer: React.FC<BottomPopupContainerProps> = () => {

  const handlePressRequestMic = () => {};
  const handlePressScreenShare = () => {};
  
  return (
    <BottomPopupPresenter
      isMaster={true}
      onPressRequestMic={handlePressRequestMic}
      onPressScreenShare={handlePressScreenShare}
    />
  );
};
export default BottomPopupContainer;
