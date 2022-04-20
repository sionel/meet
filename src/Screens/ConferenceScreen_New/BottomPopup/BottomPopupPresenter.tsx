import { View, Text, Platform, SafeAreaView, StyleSheet } from 'react-native';
import React, { Fragment } from 'react';
import { BottomPopupPresenterProps } from '@screens/ConferenceScreen_New/types';
import {
  ChattingANDROID,
  ChattingIOS,
  MenuList,
  Participants
} from './components';

const BottomPopupPresenter: React.FC<BottomPopupPresenterProps> = ({
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
  onPressInvite,
  ToggleSpeakerClick,
  onPressProfile,
  onPressMaster,
  onPressKick,
  setIsProfile,
  // InviteList,
  onPressEmail,
  onPressSms,
  onPressShare,
  onPressLink,
  onPressCode
}) => {
  return (
    <SafeAreaView style={styles.BotPopupSAV}>
      <MenuList
        isMaster={isMaster}
        onPressSketch={onPressSketch}
        onPressDocumentShare={onPressDocumentShare}
        onPressRequestMic={onPressRequestMic}
        onPressScreenShare={onPressScreenShare}
      />
      {/* {Platform.OS === 'ios' ? (
        <ChattingIOS
          myMessage={myMessage}
          cdm={cdm}
          scrollRef={scrollRef}
          messages={messages}
          onPressSend={onPressSend}
          setMyMessage={setMyMessage}
          setIsEndScroll={setIsEndScroll}
          setCdm={setCdm}
          getUserName={getUserName}
        />
      ) : (
        <ChattingANDROID
          myMessage={myMessage}
          cdm={cdm}
          scrollRef={scrollRef}
          messages={messages}
          onPressSend={onPressSend}
          setMyMessage={setMyMessage}
          setIsEndScroll={setIsEndScroll}
          setCdm={setCdm}
          getUserName={getUserName}
        />
      )} */}
      {/* <Participants
        isRoomMaster={isRoomMaster}
        isProfile={isProfile}
        isInviteList={isInviteList}
        swipeRef={swipeRef}
        userInfo={userInfo}
        onPressInvite={onPressInvite}
        ToggleSpeakerClick={ToggleSpeakerClick}
        onPressProfile={onPressProfile}
        onPressMaster={onPressMaster}
        onPressKick={onPressKick}
        setIsProfile={setIsProfile}
        //InviteList
        onPressEmail={onPressEmail}
        onPressSms={onPressSms}
        onPressShare={onPressShare}
        onPressLink={onPressLink}
        onPressCode={onPressCode}
      /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  BotPopupSAV: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    zIndex: 1
  }
});
export default BottomPopupPresenter;
