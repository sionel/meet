import { View, Text } from 'react-native';
import React, { Fragment } from 'react';
import { BottomPopupPresenterProps } from '../types';
import MenuList from './MenuList';
import Chatting from './Chatting';
import Participant from './Participants';

const BottomPopupPresenter: React.FC<BottomPopupPresenterProps> = ({
  insets,
  // MenuList
  isMaster,
  onPressSketch,
  onPressDocumentShare,
  onPressScreenShare,
  onPressRequestMic,
  // Chatting
  myMessage,
  onPressSend,
  // Participant
  isRoomMaster,
  swipeRef,
  onPressInvite,
  ToggleSpeakerClick,
  onPressProfile,
  onPressMaster,
  onPressKick
}) => {
  return (
    <Fragment>
      {/* <MenuList
        insets={insets}
        isMaster={isMaster}
        onPressSketch={onPressSketch}
        onPressDocumentShare={onPressDocumentShare}
        onPressRequestMic={onPressRequestMic}
        onPressScreenShare={onPressScreenShare}
      /> */}
      {/* <Chatting
        insets={insets}
        myMessage={myMessage}
        onPressSend={onPressSend}
      /> */}
      <Participant
        insets={insets}
        isRoomMaster={isRoomMaster}
        swipeRef={swipeRef}
        onPressInvite={onPressInvite}
        ToggleSpeakerClick={ToggleSpeakerClick}
        onPressProfile={onPressProfile}
        onPressMaster={onPressMaster}
        onPressKick={onPressKick}
      />
    </Fragment>
  );
};
export default BottomPopupPresenter;
