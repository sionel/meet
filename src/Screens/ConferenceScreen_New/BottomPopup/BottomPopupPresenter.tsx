import { View, Text, Platform } from 'react-native';
import React, { Fragment } from 'react';
import { BottomPopupPresenterProps } from '../types';
import MenuList from './MenuList';
import ChattingIOS from './ChattingIOS';
import ChattingANDROID from './ChattingANDROID';
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
  messages,
  keyboardH,
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
  onClickEmail,
  onClickSms,
  onClickShare,
  onClickLink,
  onClickCode
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
      />
      */}
      {Platform.OS === 'ios' ? (
        <ChattingIOS
          myMessage={myMessage}
          insets={insets}
          cdm={cdm}
          scrollRef={scrollRef}
          keyboardShow={keyboardShow}
          messages={messages}
          keyboardH={keyboardH}
          onPressSend={onPressSend}
          setMyMessage={setMyMessage}
          setIsEndScroll={setIsEndScroll}
          setCdm={setCdm}
          getUserName={getUserName}
        />
      ) : (
        <ChattingANDROID
          myMessage={myMessage}
          insets={insets}
          cdm={cdm}
          scrollRef={scrollRef}
          keyboardShow={keyboardShow}
          messages={messages}
          keyboardH={keyboardH}
          onPressSend={onPressSend}
          setMyMessage={setMyMessage}
          setIsEndScroll={setIsEndScroll}
          setCdm={setCdm}
          getUserName={getUserName}
        />
      )}
      {/* <Participant
        insets={insets}
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
        onClickEmail={onClickEmail}
        onClickSms={onClickSms}
        onClickShare={onClickShare}
        onClickLink={onClickLink}
        onClickCode={onClickCode}
      /> */}
    </Fragment>
  );
};
export default BottomPopupPresenter;
