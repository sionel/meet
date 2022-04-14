import { ParticipantsTypes } from '@redux/participants';
import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomPopupContainerProps } from '../types';
import BottomPopupPresenter from './BottomPopupPresenter';

const BottomPopupContainer: React.FC<BottomPopupContainerProps> = ({
  handleSpeaker
}) => {
  const insets = useSafeAreaInsets();
  //#region UseState
  // MenuList

  // Chat
  const [myMessage, setMyMessage] = useState('');
  const [cdm, setCdm] = useState(false);
  const [isEndScroll, setIsEndScroll] = useState(true);
  const scrollRef: MutableRefObject<any> = useRef();
  // UserList
  const swipeRef: MutableRefObject<any> = React.useRef([]);
  const [isRoomMaster, setIsRoomMaster] = useState(true);
  const [keyboardShow, setKeyboardShow] = useState(false);

  //#endregion UseState

  //#region Method

  const getUserName = (user: ParticipantsTypes) => {
    if (user.userInfo) {
      if (user.userInfo.nickname) {
        return user.userInfo.nickname + '(' + user.userInfo.userName + ')';
      } else return user.userInfo.userName;
    } else return user.name;
  };

  // MenuList
  const handlePressSketch = () => {};
  const handlePressDocumentShare = () => {};
  const handlePressScreenShare = () => {};
  const handlePressRequestMic = () => {};

  // Chat
  const handlePressSend = () => {};

  // UserList
  const handlePressInvite = () => {};
  const handlePressProfile = () => {};
  const handlePressMaster = () => {};
  const handlePressKick = () => {};

  //#endregion Method

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => handdleKeyboardShow());
    Keyboard.addListener('keyboardDidHide', () => handdleKeyboardHide());

    return () => {
      Keyboard.removeListener('keyboardDidShow', () => handdleKeyboardShow());
      Keyboard.removeListener('keyboardDidHide', () => handdleKeyboardHide());
    };
  }, []);

  const handdleKeyboardShow = () => {
    setKeyboardShow(true);
  };

  const handdleKeyboardHide = () => {
    setKeyboardShow(false);
  };

  return (
    <BottomPopupPresenter
      getUserName={getUserName}
      //MenuList
      isMaster={true}
      insets={insets}
      onPressSketch={handlePressSketch}
      onPressDocumentShare={handlePressDocumentShare}
      onPressRequestMic={handlePressRequestMic}
      onPressScreenShare={handlePressScreenShare}
      //Chat
      myMessage={myMessage}
      cdm={cdm}
      scrollRef={scrollRef}
      keyboardShow={keyboardShow}
      onPressSend={handlePressSend}
      setMyMessage={setMyMessage}
      setIsEndScroll={setIsEndScroll}
      setCdm={setCdm}
      //Participant
      isRoomMaster={isRoomMaster}
      swipeRef={swipeRef}
      onPressInvite={handlePressInvite}
      onPressProfile={handlePressProfile}
      onPressMaster={handlePressMaster}
      onPressKick={handlePressKick}
      ToggleSpeakerClick={handleSpeaker}
    />
  );
};
export default BottomPopupContainer;
