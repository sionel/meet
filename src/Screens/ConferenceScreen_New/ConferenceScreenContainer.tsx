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
// import test from './conferenceUtil/test';
import Conference from './conferenceUtil/Conference';
// import { isSuccess } from '@services/types';
import MeetApi from '@services/api/MeetApi';

import { actionCreators as ConferenceActions } from '@redux/conference';
import { actionCreators as ParticipantsActions } from '@redux/participants_copy';
// import { actionCreators as MainuserActions } from '@redux/mainUser_copy';
import { actionCreators as MasterActions } from '@redux/master';
import { actionCreators as ToastActions } from '@redux/toast';
import { useTranslation } from 'react-i18next';
import { isSuccess } from '@services/types';
// import { actionCreators as ScreenShareActions } from '@redux/ScreenShare';

type speakerInfo = {
  name: string;
  selected: boolean;
  type: string;
  uid: string;
};

const { OS } = Platform;
const ExternalAPI = NativeModules.ExternalAPI;

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
  const [isConnected, setIsConnected] = useState(false);
  const { t } = useTranslation();
  //#region useSelector
  const {
    state,
    testFlag,
    auth,
    isLogin,
    room,
    isSpeakerOn,
    bottomDisplayType,
    externalAPIScope,
    mikeState,
    documentShare,
    participants,
    mode
  } = useSelector((state: RootState) => ({
    testFlag: state.test.testFlag,
    state,
    auth: state.user.auth,
    isLogin: state.user.isLogin,
    //회의 관련, 개인환경
    room: state.conference.room,
    isSpeakerOn: state.conference.isSpeakerOn,
    bottomDisplayType: state.conference.bottomDisplayType,
    externalAPIScope: state.conference.externalAPIScope,
    mikeState: state.conference.mikeState,
    //문서공유
    documentShare: state.documentShare,
    //참여자
    participants: state.participants_copy.list,
    //메인화면
    mode: state.mainUser_copy.mode
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
  const setIsMuteMike = (flag: boolean) => {
    dispatch(ConferenceActions.setIsMuteMike(flag));
  };
  const resetUserlist = () => {
    dispatch(ParticipantsActions.resetUserlist());
  };
  const resetResource = () => dispatch(ConferenceActions.resetResource());

  const setToastMessage = (toastMessage: string) => {
    dispatch(ToastActions.setToastMessage(toastMessage));
  };

  const changeMasterControlMode = (masterID: string) => {
    dispatch(MasterActions.changeMasterControlMode(masterID));
  };

  const changeAudioActive = (flag: boolean) => {
    dispatch(MasterActions.changeAudioActive(flag));
  };

  //#endregion

  useEffect(() => {
    _addSpeakerListner();
    _connectConference();
    return () => {};
  }, []);

  useEffect(() => {
    let plength = participants.length;
    if (documentShare.attributes && plength > 0) {
      room?.sendMessage.documentShareTarget(
        participants[plength - 1],
        documentShare,
        mode
      );
    }
  }, [participants.length]);

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
        params.tracks,
        t
      );

      retriveMasters(params.roomToken);
      const userId = conference.getMyId();
      MeetApi.enterMeetRoom(params.roomToken, userId, params.name);

      const master = await MeetApi.checkMasterControl(params.id);
      if (isSuccess(master)) {
        console.log('master : ',  master);
        
        const { videoseq, audio_active } = master.resultData;
        const id = videoseq;
        const audioPolicy = audio_active;

        changeMasterControlMode(id);
        changeAudioActive(id ? !audioPolicy : mikeState.isMuted());
        setIsMuteMike(id ? !audioPolicy : mikeState.isMuted());

        setToastMessage(id ? t('toast_master_clton') : '');
      }

      // 안드로이드 화면공유를 위해서 네이티브단에 회의입장했다는 노티를 보내줌
      ExternalAPI.sendEvent(
        'CONFERENCE_JOINED',
        {
          url: `https://video.wehago.com/${params.id}`
        },
        externalAPIScope
      );

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
    room && room.dispose();
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
      roomToken={params.roomToken}
      handleClose={_handleClose}
      isChatting={bottomDisplayType === 'CHATTING'}
    />
  );
};
export default ConferenceScreenContainer;
