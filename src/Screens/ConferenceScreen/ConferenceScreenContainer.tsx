/**
 * ConferenceScreenContainer
 * 화상회의 화면 컨테이너
 */

import React, { useEffect, useState } from 'react';
import {
  AppState,
  DeviceEventEmitter,
  NativeModules,
  Platform,
  Dimensions,
  ToastAndroid,
  NativeEventEmitter,
  Alert,
  AppStateStatus
} from 'react-native';
import KeepAwake from 'react-native-keep-awake';

import ConferenceScreenPresenter from './ConferenceScreenPresenter';
import EndCallMessage from './EndCallMessage';
import ConferenceManager from '../../utils/conference/ConferenceManager';
import MeetApi from '../../services/api/MeetApi';
import Orientation from 'react-native-orientation-locker';
import DeviceInfo from 'react-native-device-info';

import { setConferenceManager } from '../../utils/ConferenceManager';
import { getT } from '../../utils/translateManager';

const { PictureInPicture } = NativeModules;
const { width, height } = Dimensions.get('window');
const platform = Platform.OS;

import { MeetNavigationProps } from '../../Navigations/RootNavigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/configureStore';

import { actionCreators as DocumentShareActions } from '../../redux/modules/documentShare';
import { actionCreators as LocalActions } from '../../redux/modules/local';
import { actionCreators as MasterActions } from '../../redux/modules/master';
import { actionCreators as AlertAcions } from '../../redux/modules/alert';
import { actionCreators as MainUserAcions } from '../../redux/modules/mainUser';
import { actionCreators as ToastAcions } from '../../redux/modules/toast';
import { actionCreators as ScreenShareAcions } from '../../redux/modules/ScreenShare';
import { actionCreators as ParticipantsAcions } from '../../redux/modules/participants';
import { actionCreators as indicatorAcionCreators } from '../../redux/modules/indicator';
import { actionCreators as RootActions } from '../../redux/modules/root';
import { actionCreators as ConferenceActions } from '../../redux/modules/conference';

const ConferenceScreenContainer = (
  { navigation, route: { params } }: MeetNavigationProps<'ConferenceView'>,
  props: any
) => {
  const [screen, setScreen] = useState(true);
  const [appState, setAppState] = useState<AppStateStatus>('active');
  const [conferenceState, setConferenceState] = useState({
    isMuteVideo: false,
    isMuteMic: false,
    isMuteSpeaker: false,
    volume: 0
  });
  const [connection, setConnection] = useState(false);
  const [selectedRoomName, setSelectedRoomName] = useState('');
  const [endCall, setEndCall] = useState(false);
  const [endUser, setEndUser] = useState(null);
  const [createdTime, setCreatedTime] = useState(null);
  const [pipMode, setPipMode] = useState(false);
  const t = getT();
  const { ExternalAPI } = NativeModules;
  const eventEmitter = new NativeEventEmitter(ExternalAPI);
  //#region Selector
  const {
    user: { auth, isLogin },
    local: { user, externalAPIScope },
    screenShare: { isScreenShare, screenToggleFlag },
    conference: { isConference, conferenceManager },
    list,
    mainUserId,
    documentShare
  } = useSelector((state: RootState) => ({
    user: state.user,
    local: state.local,
    screenShare: state.screenShare,
    conference: state.conference,
    list: state.participants.list,
    mainUserId: state.mainUser.mainUserId,
    documentShare: state.documentShare
  }));
  //#endregion

  //#region Dispatch
  const dispatch = useDispatch();
  const toggleMuteVideo = (muteState: any) =>
    dispatch(LocalActions.toggleMuteVideo(muteState));
  const toggleMuteMicByMe = (micMute: any) =>
    dispatch(MasterActions.toggleMuteMicByMe(micMute));
    const setConferenceManager = (manager: ConferenceManager | null) =>
    dispatch(ConferenceActions.setConferenceManager(manager));
  const setAlert = (params: any) => dispatch(AlertAcions.setAlert(params));
  const setIsConference = (flag: boolean) =>
    dispatch(ConferenceActions.setIsConference(flag));
  const joinConference = (params: any) =>
    dispatch(LocalActions.joinConference(params));
  const changeMasterControlMode = (flag: any) =>
    dispatch(MasterActions.changeMasterControlMode(flag));
  const changeAudioActive = (flag: any) =>
    dispatch(MasterActions.changeAudioActive(flag));
  const setToastMessage = (msg: string) =>
    dispatch(ToastAcions.setToastMessage(msg));
  const setMainUserNotExist = () =>
    dispatch(MainUserAcions.setMainUserNotExist());
  const initParticipants = () =>
    dispatch(ParticipantsAcions.initParticipants());
  const initMainUser = () => dispatch(MainUserAcions.initMainUser());
  const resetVideoId = () => dispatch(RootActions.setVideoId(''));
  const setScreenFlag = (flag: boolean) =>
    dispatch(ScreenShareAcions.setScreenFlag(flag));
  const setSharingMode = () => dispatch(DocumentShareActions.setSharingMode());
  const toggleScreenFlag = () => dispatch(ScreenShareAcions.toggleScreenFlag());
  //#endregion

  let backTimeout: any = null;
  let timer: any = null;
  // let conferenceManager: ConferenceManager | null = null;

  const getMainUser = (mainUserId: any, localUser: any, participants: any) => {
    if (!localUser) {
      return null;
    } else if (mainUserId === localUser.id) {
      return localUser;
    } else {
      return participants.find(
        (participant: any) => participant.id === mainUserId
      );
    }
  };

  const mainUser = getMainUser(mainUserId, user, list);
  const isMuteMic = user?.isMuteMic;
  const user_name = auth.user_name;

  useEffect(() => {
    platform === 'android' &&
      AppState.addEventListener('change', _handleAppStateChange);

    _joinConference();

    KeepAwake.activate();
    DeviceEventEmitter.addListener(
      'ON_HOME_BUTTON_PRESSED',
      _handleEnterPIPMode
    );

    timer =
      platform === 'android' &&
      setInterval(() => {
        _handleAppSizeChange();
      }, 500);
    return () => {
      try {
        if (isConference) {
          setIsConference(false);
        }
        setScreen(false);
        KeepAwake.deactivate();
        DeviceEventEmitter.removeListener(
          'ON_HOME_BUTTON_PRESSED',
          _handleEnterPIPMode
        );
        AppState.removeEventListener('change', _handleAppStateChange);
        timer && clearInterval(timer);
        // 컴포넌트가 언마운트 되기전 화상회의 관련 리소스를 해제 한다.
        ExternalAPI.sendEvent(
          'CONFERENCE_TERMINATED',
          {
            url: null
          },
          externalAPIScope
        );
        eventEmitter.removeAllListeners(ExternalAPI.TOGGLE_SCREEN_SHARE);
        // _conferenceManager?.dispose();
        setSharingMode();
        // connectFailCheck && clearInterval(connectFailCheck);
        setConferenceManager(null);
        conferenceManager?.dispose();
      } catch (error) {}
    };
  }, []);

  useEffect(() => {
    if (platform === 'android') {
      console.log(1111);
      _handleChangeScreen();
    }

    if (conferenceManager && mainUserId) {
      conferenceManager.selectParticipant(mainUserId);
    }

    // 드로잉 중에 유저 접속시 실행
    if (conferenceManager && list.length > 0 && documentShare.attributes) {
      conferenceManager.documentShareTarget(
        list[list.length - 1],
        documentShare
      );
    }
  }, [screenToggleFlag, mainUserId, list.length]);

  const _handleAppStateChange = (nextAppState: AppStateStatus) => {
    // PIP 모드에서는 appState가 변경되지 않는다.
    // 따라서 아래 로직은 PIP 모드를 지원하지 않을 때 동작한다.

    if (appState === 'active' && nextAppState !== 'active') {
      ToastAndroid.show(t('toast_background'), ToastAndroid.SHORT);
      if (isScreenShare) {
      } else {
        // backgroiund 시 video 설정 기억
        if (user) {
          const { isMuteVideo } = user;
          let state = conferenceState;
          setConferenceState({ ...state, isMuteVideo });
        }
        // 비디오 off
        toggleMuteVideo(true);
      }
    } else if (appState !== 'active' && nextAppState === 'active') {
      // active 시 video 설정 원래대로
      toggleMuteVideo(conferenceState.isMuteVideo);
    }

    setAppState(nextAppState);
    if (nextAppState === 'active') {
      // active 시 video 설정 원래대로
      toggleMuteVideo(conferenceState.isMuteVideo);

      if (platform === 'android') {
        // mic 설정 원래대로
        toggleMuteMicByMe(conferenceState.isMuteMic);

        if (backTimeout) {
          clearTimeout(backTimeout);
        }
      }
    } else {
      // backgroiund 시 video, mic, 설정 기억
      if (user) {
        const { isMuteVideo, isMuteMic } = user;
        let state = conferenceState;
        setConferenceState({ ...state, isMuteVideo, isMuteMic });
      }

      if (platform === 'android' || !isScreenShare) {
        _handleBackgroundWarning();
      }
    }
  };

  const _handleBackgroundWarning = () => {
    if (backTimeout) {
      clearTimeout(backTimeout);
    }

    ToastAndroid.show(t('toast_micwilloff'), ToastAndroid.LONG);

    backTimeout = setTimeout(() => {
      toggleMuteMicByMe(true); // mic mute
      ToastAndroid.show(t('toast_micoff'), ToastAndroid.SHORT);
    }, 7500);
  };

  const _joinConference = async () => {
    const {
      name,
      selectedRoomName,
      id: roomName,
      roomToken: token,
      externalUser,
      tracks
    } = params;

    // conferenceManager = new ConferenceManager(dispatch, _handleConferenceClose);
    // setConferenceManager(new ConferenceManager(dispatch, _handleConferenceClose));

    const sendCommandParams = {
      wehagoId: auth.portal_id,
      companyFullpath: auth.last_company?.full_path,
      profile_url: auth.profile_url ? auth.profile_url : '',
      userName: name,
      nickname: auth.nickname,
      isExternalParticipant: !isLogin,
      externalUserId: externalUser,
      isMobile: true
    };
    const joinResult = await conferenceManager?.join(
      roomName,
      token,
      tracks,
      sendCommandParams
    );
    
    if (!joinResult) {
      if (screen) {
        setAlert({
          type: 1,
          title: '알림',
          message: '입장에 실패하였습니다.'
        });
        _handleConferenceClose();
      }
      return false;
    } else {
      eventEmitter.addListener(
        ExternalAPI.TOGGLE_SCREEN_SHARE,
        _handleChangeScreen
      );

      const userId = conferenceManager?.getMyId();
      MeetApi.enterMeetRoom(token, userId, name);
      setIsConference(true);

      const videoTrack = tracks.find(
        (track: any) => track.getType() === 'video'
      );
      const audioTrack = tracks.find(
        (track: any) => track.getType() === 'audio'
      );
      joinConference({
        cid: userId,
        name,
        videoTrack,
        audioTrack
      });

      const master = await MeetApi.checkMasterControl(roomName);
      const id = master.resultData.videoseq;
      changeMasterControlMode(id);
      const audioPolicy = conferenceManager?.getAudioMuted();
      changeAudioActive(!audioPolicy);

      setToastMessage(id ? t('toast_master_clton') : '');
      ExternalAPI.sendEvent(
        'CONFERENCE_JOINED',
        {
          url: `https://video.wehago.com/${roomName}`
        },
        externalAPIScope
      );
      setConnection(true);
      setSelectedRoomName(selectedRoomName);
      conferenceManager && setConferenceManager(new ConferenceManager(dispatch, _handleConferenceClose));
      setMainUserNotExist();
    }
  };

  const _handleEnterPIPMode = () => {
    PictureInPicture.enterPictureInPicture()
      .then(() => setPipMode(true))
      .catch(() => {
        // Picture-in-Picture not supported
      });
  };

  const _handleAppSizeChange = () => {
    // 기존의 기기 가로,세로와 현재의 가로,세로를 비교하여 PIP MODE 구분
    const { width: pWidth, height: pHeight } = Dimensions.get('window');
    const pipMode = Math.min(width, height) * 0.8 > Math.min(pWidth, pHeight);
    setPipMode(pipMode);
  };

  const _handleConferenceClose = async () => {
    initParticipants();
    initMainUser();
    if (!isLogin) {
      navigation.reset({ routes: [{ name: 'LoginStack' }] });
    } else {
      navigation.reset({ routes: [{ name: 'MainStack' }] });
    }    
    resetVideoId();
    setIsConference(false);
    setConnection(false);
    setEndCall(true);
  };

  const _handleChangeScreen = async () => {
    const newTrackType = isScreenShare ? 'video' : 'desktop';
    try {
      await conferenceManager?.changeTrack(newTrackType, user.videoTrack);
      setScreenFlag(!isScreenShare);
      if (newTrackType === 'video') {
        toggleMuteVideo(true);
        setTimeout(() => {
          toggleMuteVideo(false);
        }, 500);
      }
    } catch (error) {
      setScreenFlag(false);
    }
  };

  const _handleEndCall = () => {
    if (isScreenShare) {
      toggleScreenFlag();
      if (platform === 'ios') return;
    }
    _handleConferenceClose();
  };

  /**
   * _handleClear
   * 드로잉데이터 전송
   */
  const _handleClear = () => {
    conferenceManager?.setClear();
  };

  /**
   * _handleSetDrawingData
   * 드로잉데이터 전송
   */
  const _handleSetDrawingData = (data: any) => {
    conferenceManager?.setDrawingData(data, documentShare.page);
  };

  /**
   * _handleChangeDrawingMode
   */
  const _handleChangeDrawingMode = (isDrawingShare: any) => {
    conferenceManager?.setDrawingShareMode(isDrawingShare);
  };

  /**
   * _handleChangeSharingMode
   */
  const _handleChangeSharingMode = (status: any) => {
    conferenceManager?.setToogleDocumentShare(status);
  };

  /**
   * _handleSetDocumentPage
   * 페이지 전환 전송
   */
  const _handleChangeDocumentPage = (page: any, presenter: any) => {
    // this._handleSetDrawingData(); // 페이지 전환 시 드로잉 데이터 삭제
    conferenceManager?.setDocumentPage(page, presenter);
  };

  const _handleToggleMic = () => {
    if (isMuteMic) {
      conferenceManager?.requestAttention(user_name);
    } else {
      conferenceManager?.stopAttention(user_name);
      toggleMuteMicByMe(isMuteMic);
    }
  };
  return !endCall ? (
    <ConferenceScreenPresenter
      mainUser={mainUser}
      connection={connection}
      callType={3}
      selectedRoomName={selectedRoomName}
      pipMode={pipMode}
      // onBack={_handleConferenceClose} // 여기서는 단순 뒤로 가는 것이기에... 백으로...
      onClose={_handleEndCall}
      onClear={_handleClear}
      onSetDrawingData={_handleSetDrawingData}
      onChangeDrawingMode={_handleChangeDrawingMode}
      onChangeSharingMode={_handleChangeSharingMode}
      onChangeDocumentPage={_handleChangeDocumentPage}
      onChangeMicMaster={_handleToggleMic}
      // isDeployedServices={isDeployedServices}
      toggleScreenFlag={props.toggleScreenFlag}
    />
  ) : (
    <EndCallMessage
      user={endUser}
      createdTime={createdTime}
      onClose={_handleConferenceClose}
    />
  );
};

export default ConferenceScreenContainer;
