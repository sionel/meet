import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { Keyboard, Linking, Platform, Share } from 'react-native';

import { BottomPopupContainerProps } from '@screens/ConferenceScreen_New/types';

import { MeetApi } from '@services/index';

import { getT } from '@utils/translateManager';
import Clipboard from '@react-native-clipboard/clipboard';

import BottomPopupPresenter from './BottomPopupPresenter';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/configureStore';

import { actionCreators as ParticipantsActions } from '@redux/participants_copy';
import { actionCreators as ConferenceActions } from '@redux/conference';
import { actionCreators as ScreenShareAction } from '@redux/ScreenShare';
import { actionCreators as MainUserAction } from '@redux/mainUser_copy';
import { isSuccess } from '@services/types';
import { useScreenShareStatus } from '../ScreenShare/hooks/useScreenShare';
import { REQUEST_MIC_CONTROL } from '@utils/conference/ConferenceConnector';

const BottomPopupContainer: React.FC<BottomPopupContainerProps> = ({
  roomId,
  roomToken
}) => {
  const { OS } = Platform;
  //#region useSelector
  const {
    bottomDisplayType,
    participants,
    myId,
    myJitsiId,
    masterList,
    messages,
    room,
    auth,
    isScreenShare,
    myVideoState,
    isMaster
  } = useSelector((state: RootState) => ({
    bottomDisplayType: state.conference.bottomDisplayType,
    participants: state.participants_copy.list,
    myId: state.user.auth.portal_id,
    myJitsiId: state.participants_copy.list[0].jitsiId,
    masterList: state.master.masterList,
    messages: state.conference.messages,
    room: state.conference.room,
    auth: state.user.auth,
    isScreenShare: state.screenShare.isScreenShare,
    myVideoState: state.conference.videoState,
    isMaster: state.participants_copy.list[0].isMaster
  }));
  //#endregion

  const screenFlag = useScreenShareStatus();

  //#region UseState

  // MenuList
  const [isFirst, setIsFirst] = useState(true);
  const [isMicControl, setIsMicControl] = useState(false);
  // Chat
  const [myMessage, setMyMessage] = useState('');
  const [cdm, setCdm] = useState(false);
  const [isEndScroll, setIsEndScroll] = useState(true);
  const scrollRef: MutableRefObject<any> = useRef();
  const [keyboardH, setKeyboardH] = useState(0);
  //

  // UserList
  const swipeRef: MutableRefObject<any> = React.useRef([]);
  const [isRoomMaster, setIsRoomMaster] = useState(
    masterList.find(id => id === myId) !== undefined ? true : false
  );
  const [isProfile, setIsProfile] = useState(false);
  const [isInviteList, setIsInviteList] = useState(false);
  const [userInfo, setUserInfo] = useState();
  //

  //#endregion UseState

  //#region useDispatch
  const dispatch = useDispatch();
  const updateParticipants = () => {
    dispatch(ParticipantsActions.updateParticipantsIsMaster());
  };
  const setBottomDisplayType = (
    displayType: 'MENU' | 'CHATTING' | 'PARTICIPANTS' | 'FILELIST' | 'NONE'
  ) => {
    dispatch(ConferenceActions.setBottomDisplayType(displayType));
  };
  const setScreenFlag = (flag: boolean) => {
    dispatch(ScreenShareAction.setScreenFlag(flag));
  };

  const toggleScreenFlag = () => {
    dispatch(ScreenShareAction.toggleScreenFlag());
  };

  const toggleMuteVideo = (flag: boolean) => {
    dispatch(MainUserAction.toggleMuteVideo(flag));
  };
  //#endregion

  useEffect(() => {
    if (!isFirst) {
      Platform.OS === 'ios' && handleScreenShareIOS();
    } else setIsFirst(false);
  }, [screenFlag]);

  useEffect(() => {
    let timeout: number | NodeJS.Timeout = setTimeout(() => {});
    if (bottomDisplayType === 'CHATTING') {
      if (messages.length > 0) {
        if (scrollRef) {
          if (timeout) clearTimeout(timeout);
          timeout = setTimeout(() => {
            scrollRef.current.scrollToEnd();
          }, 0);
        }
      } else if (isEndScroll) {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
          scrollRef.current.scrollToEnd();
        }, 0);
      }
    }
    return () => {
      typeof timeout === 'number' && clearTimeout(timeout);
    };
  }, [cdm, messages, keyboardH]);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', e => handdleKeyboardShow(e));
    Keyboard.addListener('keyboardDidHide', () => handdleKeyboardHide());
    return () => {
      Keyboard.removeListener('keyboardDidShow', e => handdleKeyboardShow(e));
      Keyboard.removeListener('keyboardDidHide', () => handdleKeyboardHide());
    };
  }, []);

  useEffect(() => {
    updateParticipants();
  }, [participants.length]);

  useEffect(() => {
    setIsRoomMaster(
      masterList.find(mid => mid === myId) !== undefined ? true : false
    );
  }, [masterList.length]);

  useEffect(() => {
    if (bottomDisplayType === 'NONE') {
      setIsInviteList(false);
      setIsProfile(false);
    }
  }, [bottomDisplayType]);

  //#region Method

  // MenuList
  const handlePressSketch = () => {
    setBottomDisplayType('NONE');
    room && room.sendMessage.setDrawingShareMode(true);
  };
  const handlePressDocumentShare = () => {
    setBottomDisplayType('FILELIST');
  };
  const handlePressScreenShare = async () => {
    setBottomDisplayType('NONE');
    const newTrackType = isScreenShare ? 'video' : 'desktop';
    if (Platform.OS === 'android') {
      try {
        room && (await room.changeTrack(newTrackType, myVideoState));
        setScreenFlag(!isScreenShare);
        if (newTrackType === 'video') {
          toggleMuteVideo(true);
          setTimeout(() => {
            toggleMuteVideo(false);
          }, 500);
        }
      } catch (error) {
        console.log('error : ', error);
        setScreenFlag(false);
      }
    } else {
      toggleScreenFlag();
    }
  };

  const handleScreenShareIOS = async () => {
    const newTrackType = isScreenShare ? 'video' : 'desktop';
    try {
      room && (await room.changeTrack(newTrackType, myVideoState));
      setScreenFlag(!isScreenShare);
      if (newTrackType === 'video') {
        toggleMuteVideo(true);
        setTimeout(() => {
          toggleMuteVideo(false);
        }, 500);
      }
    } catch (error) {
      console.log('error : ', error);
      setScreenFlag(false);
    }
  };

  const handlePressRequestMic = async () => {
    setBottomDisplayType('NONE');
    room &&
      (await room.sendMessage.micControlMode(
        !isMicControl,
        auth.cno,
        roomToken,
        false
      ));
    setIsMicControl(!isMicControl);
  };

  // Chat
  const handlePressSend = () => {
    if (myMessage && myMessage.slice().replace(/(\s*)/g, '') !== '') {
      setMyMessage('');
      room && room.sendTextMessage(myMessage);
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
    setIsInviteList(false);
  };

  const handlePressSms = () => {
    const Divider: string = OS === 'ios' ? '&' : '?';
    Linking.openURL(
      `sms:${Divider}body=https://video.wehago.com/video?room=${roomId}`
    );
    setIsInviteList(false);
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
      setIsInviteList(false);
    } catch (error) {
      console.warn(error);
    }
  };

  const handlePressLinkCopy = () => {
    Clipboard.setString(`https://video.wehago.com/video?room=${roomId}`);
    //다국어 필요
    // setToastMessage(t('공유링크가 복사되었습니다.'));
    setIsInviteList(false);
  };

  const handlePressJoincodeCopy = async () => {
    let joincode;
    const getJoincode = await MeetApi.getJoincode(auth, roomId);
    if (isSuccess(getJoincode)) {
      joincode = getJoincode.resultData;
      Clipboard.setString(joincode);
      //다국어 필요
      // setToastMessage(t('참여코드가 복사되었습니다.'));
    } else {
      console.warn('3-46 getJoincode : ', getJoincode.errors);
    }
    setIsInviteList(false);
  };

  //#endregion Method

  const handdleKeyboardShow = (e: any) => {
    setKeyboardH(e.endCoordinates.width);
  };

  const handdleKeyboardHide = () => {
    setKeyboardH(0);
  };

  const handlePressSpeaker = () => {};

  return (
    <BottomPopupPresenter
      bottomDisplayType={bottomDisplayType}
      // getUserName={getUserName}
      //MenuList
      isMaster={isMaster}
      isMicControl={isMicControl}
      onPressSketch={handlePressSketch}
      onPressDocumentShare={handlePressDocumentShare}
      onPressRequestMic={handlePressRequestMic}
      onPressScreenShare={handlePressScreenShare}
      //Chat
      myMessage={myMessage}
      cdm={cdm}
      scrollRef={scrollRef}
      messages={messages}
      myJitsiId={myJitsiId}
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
      participants={participants}
      roomId={roomId}
      onPressInvite={handlePressInvite}
      onPressProfile={handlePressProfile}
      onPressMaster={handlePressMaster}
      onPressKick={handlePressKick}
      ToggleSpeakerClick={handlePressSpeaker}
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
