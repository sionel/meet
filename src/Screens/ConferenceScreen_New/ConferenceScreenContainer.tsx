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
import { actionCreators as MasterActions } from '@redux/master';
// import { actionCreators as MainuserActions } from '@redux/mainUser_copy';

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

  const [first, setfirst] = useState();
  const [isConnected, setIsConnected] = useState(false);

  //#region useSelector
  const { state, testFlag, auth, participants, room, isSpeakerOn, isLogin } =
    useSelector((state: RootState) => ({
      testFlag: state.test.testFlag,
      auth: state.user.auth,
      state,
      participants: state.participants_copy.list,
      room: state.conference.room,
      isSpeakerOn: state.conference.isSpeakerOn,
      isLogin: state.user.isLogin
    }));
  //#endregion

  //#region useDispatch
  const dispatch = useDispatch();
  const setRoom = (conference: Conference) => {
    dispatch(ConferenceActions.setRoom(conference));
  };
  const retriveMasters = (token: string) => {
    dispatch(MasterActions.checkMasterList(token));
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
  const resetVideoState = () => {
    dispatch(ConferenceActions.setVideoState(undefined));
  };
  const resetMikeState = () => {
    dispatch(ConferenceActions.setMikeState(undefined));
  };
  const resetExpireTime = () => dispatch(ConferenceActions.setExpireTime(null));
  //#endregion

  useEffect(() => {
    _addSpeakerListner();
    _connectConference();

    return () => {};
  }, []);

  const _connectConference = async () => {
    conference = new Conference();

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
      setIsConnected(true);
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

  //#region 화상회의 종료( 자원 정리 )
  const _handleClose = () => {
    room.dispose();
    setIsConnected(false);
    resetUserlist();
    resetVideoState();
    resetMikeState();
    setIsSpeakerOn(false);
    setIsBtOn(false);
    resetExpireTime();
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
    />
  );
};
export default ConferenceScreenContainer;