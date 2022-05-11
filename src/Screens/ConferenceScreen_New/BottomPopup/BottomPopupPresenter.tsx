import { View, Text, Platform, SafeAreaView, StyleSheet } from 'react-native';
import React, { Fragment } from 'react';
import { BottomPopupPresenterProps } from '@screens/ConferenceScreen_New/types';
import {
  ChattingANDROID,
  ChattingIOS,
  MenuList,
  Participants
} from './components';
import FileList from './components/FileList';
import ScreenShareIOS from '../ScreenShare/ScreenShareIOS';
import ScreenShareANDROID from '../ScreenShare/ScreenShareANDROID';

const BottomPopupPresenter: React.FC<BottomPopupPresenterProps> = ({
  // getUserName,
  bottomDisplayType,
  // MenuList
  isMaster,
  isMicControl,
  onPressSketch,
  onPressDocumentShare,
  onPressScreenShare,
  onPressRequestMic,
  // Chatting
  myMessage,
  cdm,
  scrollRef,
  myJitsiId,
  onPressSend,
  setMyMessage,
  setIsEndScroll,
  setCdm,
  messages,
  // Participants
  isRoomMaster,
  swipeRef,
  isProfile,
  isInviteList,
  userInfo,
  participants,
  roomId,
  onPressInvite,
  onPressProfile,
  onPressMaster,
  onPressKick,
  onPressMike,
  setIsProfile,
  // InviteList,
  onPressEmail,
  onPressSms,
  onPressShare,
  onPressLink,
  onPressCode
}) => {
  return (
    <SafeAreaView style={[styles.BotPopupSAV, bottomDisplayType === 'CHATTING' && {height: '100%', zIndex: 0}]}>
      {Platform.OS === 'ios' ? <ScreenShareIOS /> : <ScreenShareANDROID />}
      {bottomDisplayType === 'MENU' && (
        <MenuList
          isMaster={isMaster}
          isMicControl={isMicControl}
          onPressSketch={onPressSketch}
          onPressDocumentShare={onPressDocumentShare}
          onPressRequestMic={onPressRequestMic}
          onPressScreenShare={onPressScreenShare}
        />
      )}
      {bottomDisplayType === 'CHATTING' && Platform.OS === 'ios' && (
        <ChattingIOS
          myMessage={myMessage}
          cdm={cdm}
          scrollRef={scrollRef}
          messages={messages}
          myJitsiId={myJitsiId}
          onPressSend={onPressSend}
          setMyMessage={setMyMessage}
          setIsEndScroll={setIsEndScroll}
          setCdm={setCdm}
        />
      )}
      {bottomDisplayType === 'CHATTING' && Platform.OS === 'android' && (
        <ChattingANDROID
          myMessage={myMessage}
          cdm={cdm}
          scrollRef={scrollRef}
          messages={messages}
          myJitsiId={myJitsiId}
          onPressSend={onPressSend}
          setMyMessage={setMyMessage}
          setIsEndScroll={setIsEndScroll}
          setCdm={setCdm}
        />
      )}
      {bottomDisplayType === 'PARTICIPANTS' && (
        <Participants
          isRoomMaster={isRoomMaster}
          isProfile={isProfile}
          isInviteList={isInviteList}
          swipeRef={swipeRef}
          userInfo={userInfo}
          participants={participants}
          roomId={roomId}
          onPressInvite={onPressInvite}
          onPressProfile={onPressProfile}
          onPressMaster={onPressMaster}
          onPressKick={onPressKick}
          onPressMike={onPressMike}
          setIsProfile={setIsProfile}
          //InviteList
          onPressEmail={onPressEmail}
          onPressSms={onPressSms}
          onPressShare={onPressShare}
          onPressLink={onPressLink}
          onPressCode={onPressCode}
        />
      )}
      {bottomDisplayType === 'FILELIST' && (
        <FileList/>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  BotPopupSAV: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    zIndex: 2
  }
});
export default BottomPopupPresenter;
