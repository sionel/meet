import Clipboard from '@react-native-clipboard/clipboard';
import { ParticipantsTypes } from '@redux/participants';
import { MeetApi } from '@services/index';
import { getT } from '@utils/translateManager';
import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { Keyboard, Linking, Platform, Share } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomPopupContainerProps } from '../types';
import BottomPopupPresenter from './BottomPopupPresenter';
import InviteList from './InviteList';

const BottomPopupContainer: React.FC<BottomPopupContainerProps> = ({
  roomId,
  handleSpeaker
}) => {
  const t = getT();
  const insets = useSafeAreaInsets();
  const { OS } = Platform;
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
  const [isProfile, setIsProfile] = useState(false);
  const [isInviteList, setIsInviteList] = useState(false);
  const [userInfo, setUserInfo] = useState();

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
  const handlePressInvite = () => {
    setIsInviteList(true);
  };
  const handlePressProfile = (user: any) => {
    setUserInfo(user);
    setIsProfile(true);
  };
  const handlePressMaster = () => {};
  const handlePressKick = () => {};

  // InviteList
  const handleEmail = () => {
    Linking.openURL(
      `mailto:?subject=&body=https://video.wehago.com/video?room%3D${roomId}`
    );
  };

  const handleSms = () => {
    const Divider: string = OS === 'ios' ? '&' : '?';
    Linking.openURL(
      `sms:${Divider}body=https://video.wehago.com/video?room=${roomId}`
    );
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        title: '링크 공유',
        message: `https://video.wehago.com/video?room=${roomId}`
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.warn(error);
    }
  };

  const handleLinkCopy = () => {
    // Clipboard.setString(`https://video.wehago.com/video?room=${roomId}`);
    // //다국어 필요
    // setToastMessage(t('공유링크가 복사되었습니다.'));
  };

  const handleJoincodeCopy = async () => {
    // let joincode;
    // const getJoincode = await MeetApi.getJoincode(auth, roomId);
    // if (isSuccess(getJoincode)) {
    //   joincode = getJoincode.resultData;
    //   Clipboard.setString(joincode);
    //   //다국어 필요
    //   setToastMessage(t('참여코드가 복사되었습니다.'));
    // } else {
    //   console.warn('3-46 getJoincode : ', getJoincode.errors);
    // }
  };

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
      isProfile={isProfile}
      isInviteList={isInviteList}
      swipeRef={swipeRef}
      userInfo={userInfo}
      onPressInvite={handlePressInvite}
      onPressProfile={handlePressProfile}
      onPressMaster={handlePressMaster}
      onPressKick={handlePressKick}
      ToggleSpeakerClick={handleSpeaker}
      setIsProfile={setIsProfile}
      //InviteList
      onClickEmail={handleEmail}
      onClickSms={handleSms}
      onClickShare={handleShare}
      onClickLink={handleLinkCopy}
      onClickCode={handleJoincodeCopy}
    />
  );
};
export default BottomPopupContainer;
