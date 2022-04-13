import React, { MutableRefObject, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomPopupContainerProps } from '../types';
import BottomPopupPresenter from './BottomPopupPresenter';

const BottomPopupContainer: React.FC<BottomPopupContainerProps> = ({
  handleSpeaker
}) => {
  const insets = useSafeAreaInsets();
  //#region UseState
  // MenuList
  const [myMessage, setMyMessage] = useState('');

  // Chat

  // UserList
  const swipeRef: MutableRefObject<any> = React.useRef([]);
  const [isRoomMaster, setIsRoomMaster] = useState(true);

  //#endregion UseState

  //#region Method

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

  return (
    <BottomPopupPresenter
      //MenuList
      isMaster={true}
      insets={insets}
      onPressSketch={handlePressSketch}
      onPressDocumentShare={handlePressDocumentShare}
      onPressRequestMic={handlePressRequestMic}
      onPressScreenShare={handlePressScreenShare}
      //Chat
      myMessage={myMessage}
      onPressSend={handlePressSend}
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
