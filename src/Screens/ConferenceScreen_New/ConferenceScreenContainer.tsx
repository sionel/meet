import React, { useEffect, useState } from 'react';
import {
  DeviceEventEmitter,
  NativeEventEmitter,
  NativeModules,
  Platform
} from 'react-native';
import ConferenceScreenPresenter from './ConferenceScreenPresenter';
import { ConferenceScreenContainerProps } from './types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/configureStore';
// import ConferenceManager from './conferenceUtil/ConferenceManager';
import test from './conferenceUtil/test';
import Conference from './conferenceUtil/Conference';
import { isSuccess } from '@services/types';
import MeetApi from '@services/api/MeetApi';

import { actionCreators as ConferenceActions } from '@redux/conference';
import { actionCreators as ParticipantsActions } from '@redux/participants_copy';
import { actionCreators as MainuserActions } from '@redux/mainUser_copy';
import { actionCreators as MasterActions } from '@redux/master';
// import { actionCreators as ScreenShareActions } from '@redux/ScreenShare';
import DrawingManager from './conferenceUtil/DrawingManager';

type speakerInfo = {
  name: string;
  selected: boolean;
  type: string;
  uid: string;
};

const { OS } = Platform;
const AudioMode = OS === 'ios' && NativeModules.AudioMode;
const NativeAudio = new NativeEventEmitter(AudioMode);
const InCallManager =
  OS === 'android' && require('react-native-incall-manager').default;

const ConferenceScreenContainer: React.FC<
  ConferenceScreenContainerProps
> = props => {
  const {
    navigation,
    route: { params }
  } = props;

  let conference: Conference;
  let drawing: DrawingManager;

  let ExternalAPI = NativeModules.ExternalAPI;
  let eventEmitter = new NativeEventEmitter(ExternalAPI);

  const [first, setfirst] = useState();
  const [isConnected, setIsConnected] = useState(false);

  //#region useSelector
  const {
    state,
    testFlag,
    auth,
    room,
    isSpeakerOn,
    isLogin,
    bottomDisplayType,
    myVideoState,
    mode,
    screenToggleFlag
  } = useSelector((state: RootState) => ({
    testFlag: state.test.testFlag,
    auth: state.user.auth,
    state,
    room: state.conference.room,
    isSpeakerOn: state.conference.isSpeakerOn,
    isLogin: state.user.isLogin,
    bottomDisplayType: state.conference.bottomDisplayType,
    myVideoState: state.conference.videoState,
    mode: state.mainUser_copy.mode,
    screenToggleFlag: state.screenShare.screenToggleFlag
  }));
  //#endregion

  //#region useDispatch
  const dispatch = useDispatch();
  const setRoom = (conference: Conference) => {
    dispatch(ConferenceActions.setRoom(conference));
  };
  const setDrawing = (drawing: DrawingManager) => {
    dispatch(ConferenceActions.setDrawing(drawing));
  };
  const retriveMasters = (token: string) => {
    dispatch(MasterActions.checkMasterList(token));
  };
  const setMainView = (
    mode: 'track' | 'sketch' | 'document' | 'screen' | 'character'
  ) => {
    dispatch(MainuserActions.setMainView(mode));
  };
  const setIsSpeakerOn = (isSpeakerOn: boolean) => {
    dispatch(ConferenceActions.setIsSpeakerOn(isSpeakerOn));
  };
  const setIsBtOn = (isBtOn: boolean) => {
    dispatch(ConferenceActions.setIsBtOn(isBtOn));
  };
  const resetUserlist = () => {
    dispatch(ParticipantsActions.resetUserlist());
  };
  const resetResource = () => dispatch(ConferenceActions.resetResource());
  //#endregion

  useEffect(() => {
    _addSpeakerListner();
    _connectConference();
    return () => {};
  }, []);

  useEffect(() => {
    // OS === 'android' && _handleShareScreen();
  }, [screenToggleFlag])

  const _connectConference = async () => {
    conference = new Conference();
    drawing = new DrawingManager();

    try {
      const userInfo = {
        wehagoId: auth.portal_id,
        companyFullpath: auth.last_company?.full_path,
        profile_url: auth.profile_url ? auth.profile_url : '',
        userName: params.name,
        nickname: auth.nickname,
        isExternalParticipant: !isLogin,
        externalUserId: params.externalUser,
        isMobile: true,
        user_contact: auth.user_contact,
        user_email: auth.user_eamil ? auth.user_eamil : auth.user_default_email,
        avatar: params.avatar,
        videoTrack: params.tracks[0],
        audioTrack: params.tracks[1]
      };

      await conference.join(
        { id: params.id, token: params.roomToken },
        userInfo,
        dispatch,
        params.tracks
      );

      retriveMasters(params.roomToken);
      setRoom(conference);
      setDrawing(drawing);
      setIsConnected(true);

      eventEmitter.addListener(ExternalAPI.TOGGLE_SCREEN_SHARE, event =>
        _handleShareScreen(event, room, mode)
      );
    } catch (error) {
      console.log('error: ', error);

      console.log('화상대화 접속에 실패하였습니다');
      //TODO: 화상대화 dispose 처리 필요
      // _handleClose();
    }
  };

  //#region 스피커 장치 변경 Listenr
  const _addSpeakerListner = async () => {
    if (OS === 'ios') {
      NativeAudio.addListener(
        'org.jitsi.meet:features/audio-mode#devices-update',
        event => {
          _handleIosSpeaker(event);
        }
      );
    } else {
      InCallManager.start({ media: 'video' });
      const audioPermmit = await InCallManager.requestRecordPermission();
      if (audioPermmit !== 'granted') {
        InCallManager.requestRecordPermission();
      }
      DeviceEventEmitter.addListener('onAudioDeviceChanged', event => {
        _handleAndroidSpeaker(event);
      });
    }
  };
  //#endregion

  //#region IOS 블루투스 이어폰 연결 여부
  const _handleIosSpeaker = (event: any) => {
    let enableBluetooth = false;
    enableBluetooth = event.find(
      (deviceInfo: speakerInfo) =>
        deviceInfo.selected === true && deviceInfo.type === 'BLUETOOTH'
    );
    if (enableBluetooth) {
      !isSpeakerOn && setIsSpeakerOn(true);
      setIsBtOn(true);
    } else {
      setIsBtOn(false);
    }
  };
  //#endregion

  //#region ANDROID 블루투스 이어폰 연결 여부
  const _handleAndroidSpeaker = async (event: any) => {
    const { availableAudioDeviceList } = event;
    const deviceList = JSON.parse(availableAudioDeviceList);
    const enableBluetooth = deviceList.find(
      (list: string) => list === 'BLUETOOTH'
    );
    if (enableBluetooth) {
      await InCallManager.chooseAudioRoute('BLUETOOTH');
      !isSpeakerOn && setIsSpeakerOn(true);
      setIsBtOn(true);
    } else {
      setIsBtOn(false);
    }
  };
  //#endregion

  //#region 화면공유
  const _handleShareScreen = async (event: any, a: any, b: any) => {
    console.log('event : ', event);
    console.log('a : ', a);
    console.log('b : ', b);
    
    // const { enabled } = value;
    // const newTrackType = enabled ? 'video' : 'desktop';
    // try {
    //   console.log('enabled : ', enabled);
    //   console.log('room : ', room);
      
    //   await room.changeTrack(newTrackType, myVideoState);
    //   if(enabled) setMainView('screen');
    //   else setMainView('track');
    //   if (newTrackType === 'video') {
    //     myVideoState.mute();
    //     setTimeout(() => {
    //       myVideoState.unmute();
    //     }, 500);
    //   }
    // } catch (error) {
    //   myVideoState.unmute();
    // }
  };
  //#endregion

  //#region 화상회의 종료( 자원 정리 )
  const _handleClose = () => {
    room.dispose();
    setIsConnected(false);
    resetResource();
    resetUserlist();
    if (OS === 'ios') {
      NativeAudio.removeAllListeners(
        'org.jitsi.meet:features/audio-mode#devices-update'
      );
    } else {
      DeviceEventEmitter.removeAllListeners('onAudioDeviceChanged');
    }
    if (!isLogin) {
      navigation.reset({ routes: [{ name: 'LoginStack' }] });
    } else {
      navigation.reset({ routes: [{ name: 'MainStack' }] });
    }
  };
  //#endregion

  return (
    <ConferenceScreenPresenter
      isConnected={isConnected}
      roomName={params.selectedRoomName}
      id={params.id}
      handleClose={_handleClose}
      isChatting={bottomDisplayType === 'CHATTING'}
    />
  );
};
export default ConferenceScreenContainer;
