import Clipboard from '@react-native-clipboard/clipboard';
import { ParticipantsTypes } from '@redux/participants';
import { MeetApi } from '@services/index';
import { getT } from '@utils/translateManager';
import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Keyboard,
  Linking,
  Platform,
  Share,
  TextInput,
  UIManager
} from 'react-native';
import { BottomPopupContainerProps } from '@screens/ConferenceScreen_New/types';
import BottomPopupPresenter from './BottomPopupPresenter';
import InviteList from './components/participantsComponents/InviteList';

const BottomPopupContainer: React.FC<BottomPopupContainerProps> = ({
  roomId,
  handleSpeaker
}) => {
  const t = getT();
  const { OS } = Platform;
  //#region UseState
  // MenuList

  // Chat
  const [myMessage, setMyMessage] = useState('');
  const [cdm, setCdm] = useState(false);
  const [isEndScroll, setIsEndScroll] = useState(true);
  const scrollRef: MutableRefObject<any> = useRef();
  const [keyboardH, setKeyboardH] = useState(0);
  const [messages, setMessages] = useState<
    {
      isLocalUser: boolean;
      profileUrl: string;
      userName: string;
      text: string;
    }[]
  >([
    {
      isLocalUser: true,
      profileUrl: '',
      userName: '김연길',
      text: 'text'
    },
    {
      isLocalUser: false,
      profileUrl: '',
      userName: '김연길',
      text: 'text'
    }
  ]);

  // UserList
  const swipeRef: MutableRefObject<any> = React.useRef([]);
  const [isRoomMaster, setIsRoomMaster] = useState(true);
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
  const handlePressSend = () => {
    let newMsg = messages;

    if (myMessage.length > 0) {
      newMsg.push({
        isLocalUser: true,
        profileUrl: '',
        text: myMessage,
        userName: '김연길'
      });
      setMessages(newMsg);
      setMyMessage('');
    } else {
      return;
    }
  };

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
  const handlePressEmail = () => {
    Linking.openURL(
      `mailto:?subject=&body=https://video.wehago.com/video?room%3D${roomId}`
    );
  };

  const handlePressSms = () => {
    const Divider: string = OS === 'ios' ? '&' : '?';
    Linking.openURL(
      `sms:${Divider}body=https://video.wehago.com/video?room=${roomId}`
    );
  };

  const handlePressShare = async () => {
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

  const handlePressLinkCopy = () => {
    // Clipboard.setString(`https://video.wehago.com/video?room=${roomId}`);
    // //다국어 필요
    // setToastMessage(t('공유링크가 복사되었습니다.'));
  };

  const handlePressJoincodeCopy = async () => {
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

  // useEffect(() => {
  //   let timeout: number | NodeJS.Timeout = setTimeout(() => {});

  //   if (messages.length > 0) {
  //     if (scrollRef) {
  //       if (timeout) clearTimeout(timeout);
  //       timeout = setTimeout(() => {
  //         scrollRef.current.scrollToEnd();
  //       }, 0);
  //     }
  //   } else if (isEndScroll) {
  //     if (timeout) clearTimeout(timeout);
  //     timeout = setTimeout(() => {
  //       scrollRef.current.scrollToEnd();
  //     }, 0);
  //   }

  //   return () => {
  //     typeof timeout === 'number' && clearTimeout(timeout);
  //   };
  // }, [cdm, keyboardH]);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', e => handdleKeyboardShow(e));
    Keyboard.addListener('keyboardDidHide', () => handdleKeyboardHide());
    return () => {
      Keyboard.removeListener('keyboardDidShow', e => handdleKeyboardShow(e));
      Keyboard.removeListener('keyboardDidHide', () => handdleKeyboardHide());
    };
  }, []);

  const handdleKeyboardShow = (e: any) => {
    setKeyboardH(e.endCoordinates.width);
  };

  const handdleKeyboardHide = () => {
    setKeyboardH(0);
  };

  return (
    <BottomPopupPresenter
      getUserName={getUserName}
      //MenuList
      isMaster={true}
      onPressSketch={handlePressSketch}
      onPressDocumentShare={handlePressDocumentShare}
      onPressRequestMic={handlePressRequestMic}
      onPressScreenShare={handlePressScreenShare}
      //Chat
      myMessage={myMessage}
      cdm={cdm}
      scrollRef={scrollRef}
      messages={messages}
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
      onPressEmail={handlePressEmail}
      onPressSms={handlePressSms}
      onPressShare={handlePressShare}
      onPressLink={handlePressLinkCopy}
      onPressCode={handlePressJoincodeCopy}
    />
  );
};
export default BottomPopupContainer;
