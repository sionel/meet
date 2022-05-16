import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { Alert, Keyboard, Linking, Platform, Share } from 'react-native';

import { BottomPopupContainerProps } from '@screens/ConferenceScreen/types';

import { MeetApi } from '@services/index';
import Clipboard from '@react-native-clipboard/clipboard';

import BottomPopupPresenter from './BottomPopupPresenter';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/configureStore';

import { actionCreators as ParticipantsActions } from '@redux/participants_copy';
import { actionCreators as ConferenceActions } from '@redux/conference';
import { actionCreators as ScreenShareAction } from '@redux/ScreenShare';
import { actionCreators as MainUserAction } from '@redux/mainUser_copy';
import { actionCreators as MasterActions } from '@redux/master';
import { actionCreators as ToastActions } from '@redux/toast';
import { isSuccess } from '@services/types';
import { useScreenShareStatus } from '../ScreenShare/hooks/useScreenShare';
import { useTranslation } from 'react-i18next';

const BottomPopupContainer: React.FC<BottomPopupContainerProps> = ({
  roomId,
  roomToken
}) => {
  const { OS } = Platform;
  const { t } = useTranslation();
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
    isMaster,
    isMuteMike
  } = useSelector((state: RootState) => ({
    bottomDisplayType: state.conference.bottomDisplayType,
    participants: state.participants_copy.list,
    myId: state.user.auth.portal_id,
    myJitsiId: state.participants_copy.list[0]?.jitsiId,
    masterList: state.master.masterList,
    messages: state.conference.messages,
    room: state.conference.room,
    auth: state.user.auth,
    isScreenShare: state.screenShare.isScreenShare,
    myVideoState: state.conference.videoState,
    isMaster: state.participants_copy.list[0]?.isMaster,
    isMuteMike: state.conference.isMuteMike
  }));
  //#endregion

  // console.log('masterList : ', masterList);

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
  const [initMasterID, setInitMasterID] = useState('');
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

  const setIsMuteMike = (flag: boolean) => {
    dispatch(ConferenceActions.setIsMuteMike(flag));
  };

  const setToastMessage = (message: string) => {
    dispatch(ToastActions.setToastMessage(message));
  };

  const resetRequestUserList = () => {
    dispatch(MasterActions.resetRequestUserList());
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
    Keyboard.addListener('keyboardDidShow', handdleKeyboardShow);
    Keyboard.addListener('keyboardDidHide', handdleKeyboardHide);
    getInitMasterID();
    return () => {
      Keyboard.removeListener('keyboardDidShow', handdleKeyboardShow);
      Keyboard.removeListener('keyboardDidHide', handdleKeyboardHide);
    };
  }, []);

  useEffect(() => {
    updateParticipants();
  }, [participants.length]);

  useEffect(() => {
    updateParticipants();
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
    if (isMicControl) {
      resetRequestUserList();
    }
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
  const getInitMasterID = async () => {
    const roomInfo = await MeetApi.getMeetRoomNoCert(roomId);
    if (isSuccess(roomInfo)) {
      setInitMasterID(roomInfo.resultData.portal_id);
    }
  };
  const handlePressInvite = () => {
    setIsInviteList(true);
  };
  const handlePressProfile = (user: any) => {
    setUserInfo(user);
    setIsProfile(true);
  };
  const handlePressMaster = async (wehagoID: string) => {
    if (initMasterID === wehagoID) {
      setToastMessage('방 개설자의 마스터 권한을 해제시킬 수 없습니다.');
    } else {
      let empowerList: string[] = [];
      let removeList: string[] = [];
      const copyMasterList = masterList.slice(0);

      const removeAuthUser = copyMasterList.find(
        masterID => masterID === wehagoID
      );
      removeAuthUser && removeList.push(removeAuthUser);

      if (removeAuthUser) {
        empowerList = copyMasterList.filter(
          master => master !== removeAuthUser
        );
      } else {
        empowerList = copyMasterList;
        empowerList.push(wehagoID);
      }

      const params: { master: string[]; unmaster: string[] } = {
        master: empowerList,
        unmaster: removeList
      };

      await MeetApi.setMasterList(auth, roomId, params);
      room && room.sendMessage.empowerMaster(wehagoID, removeAuthUser);
    }
  };
  const handlePressKick = () => {
    room && room.sendMessage.kickUser();
  };

  const handlePressMike = (jitsiID: string, muteFlag: boolean) => {
    if (jitsiID === myJitsiId) {
      setIsMuteMike(!isMuteMike);
    } else {
      if (isMicControl && isRoomMaster) {
        room &&
          room.sendMessage.handleOtherUserMikeDirectControl(muteFlag, jitsiID);
      } else {
        setToastMessage('마이크 제어 권한이 없습니다.');
      }
    }
  };

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
    setToastMessage(t('공유링크가 복사되었습니다.'));
    setIsInviteList(false);
  };

  const handlePressJoincodeCopy = async () => {
    let joincode;
    const getJoincode = await MeetApi.getJoincode(auth, roomId);
    if (isSuccess(getJoincode)) {
      joincode = getJoincode.resultData;
      Clipboard.setString(joincode);
      //다국어 필요
      setToastMessage(t('참여코드가 복사되었습니다.'));
    } else {
      console.warn('3-46 getJoincode : ', getJoincode.errors);
    }
    setIsInviteList(false);
  };

  //#endregion Method

  const handdleKeyboardShow = (e?: any) => {
    setKeyboardH(e.endCoordinates.width);
  };

  const handdleKeyboardHide = (e?: any) => {
    setKeyboardH(0);
  };

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
      onPressMike={handlePressMike}
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
