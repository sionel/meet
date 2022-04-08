import { View, Text } from 'react-native';
import React from 'react';
import { BottomPopupPresenterProps } from '../types';
import MenuList from './MenuList';
import Chatting from './Chatting';

const BottomPopupPresenter: React.FC<BottomPopupPresenterProps> = ({
  // MenuList
  isMaster,
  onPressRequestMic,
  onPressScreenShare
  // Chatting

  // Participant
}) => {
  return (
    <>
      <MenuList
        isMaster={isMaster}
        onPressRequestMic={onPressRequestMic}
        onPressScreenShare={onPressScreenShare}
      />
      <Chatting />
    </>
  );
};
export default BottomPopupPresenter;
