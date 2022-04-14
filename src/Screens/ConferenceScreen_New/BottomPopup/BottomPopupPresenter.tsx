import { View, Text } from 'react-native';
import React, { Fragment } from 'react';
import { BottomPopupPresenterProps } from '../types';
import MenuList from './MenuList';
import Chatting from './Chatting';
import Participant from './Participants';

const BottomPopupPresenter: React.FC<BottomPopupPresenterProps> = ({
  insets,
  getUserName,
  // MenuList
  isMaster,
  onPressSketch,
  onPressDocumentShare,
  onPressScreenShare,
  onPressRequestMic,
  // Chatting
  myMessage,
  cdm,
  scrollRef,
  keyboardShow,
  onPressSend,
  setMyMessage,
  setIsEndScroll,
  setCdm,
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
      <MenuList
        insets={insets}
        isMaster={isMaster}
        onPressSketch={onPressSketch}
        onPressDocumentShare={onPressDocumentShare}
        onPressRequestMic={onPressRequestMic}
        onPressScreenShare={onPressScreenShare}
      />
      <Chatting
        myMessage={myMessage}
        cdm={cdm}
        scrollRef={scrollRef}
        keyboardShow={keyboardShow}
        onPressSend={onPressSend}
        setMyMessage={setMyMessage}
        setIsEndScroll={setIsEndScroll}
        setCdm={setCdm}
        getUserName={getUserName}
      />
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
