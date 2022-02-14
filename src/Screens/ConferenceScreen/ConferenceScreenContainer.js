/**
 * ConferenceScreenContainer
 * 화상회의 화면 컨테이너
 */

import React from 'react';
import {
  AppState,
  DeviceEventEmitter,
  NativeModules,
  Platform,
  Dimensions,
  ToastAndroid,
  NativeEventEmitter,
  Alert
} from 'react-native';
import KeepAwake from 'react-native-keep-awake';

import ConferenceScreenPresenter from './ConferenceScreenPresenter';
import EndCallMessage from './EndCallMessage';
import ConferenceManager from '@utils/conference/ConferenceManager';
import MeetApi from '@services/api/MeetApi';
import Orientation from 'react-native-orientation-locker';
import DeviceInfo from 'react-native-device-info';

import { setConferenceManager } from '@utils/ConferenceManager';
import { getT } from '@utils/translateManager';
import { set } from 'lodash';

const { PictureInPicture, AudioMode } = NativeModules;
const { width, height } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';
const InCallManager = !isIOS && require('react-native-incall-manager').default;

const isTablet = DeviceInfo.isTablet();

class ConferenceScreenContainer extends React.Component {
  constructor(props) {
    super(props);
    this._screen = true;
    this._appState = 'active';
    this._backTimeout = null;
    this._conferenceState = {
      isMuteVideo: false,
      isMuteMic: false,
      isMuteSpeaker: false,
      volume: 0
    };
    this.state = {
      connection: false,
      selectedRoomName: '',
      endCall: false,
      endUser: null,
      createdTime: null,
      pipMode: false,
      _this: true
    };
    this.t = getT();

    this.ExternalAPI = NativeModules.ExternalAPI;
    this.eventEmitter = new NativeEventEmitter(this.ExternalAPI);
  }

  /**
   * componentDidMount
   */
  componentDidMount() {
    // const { navigation, auth, dispatch } = this.props;

    Platform.OS === 'android' &&
      AppState.addEventListener('change', this._handleAppStateChange);

    Orientation.getOrientation(orientation => {
      const status =
        orientation === 'LANDSCAPE' ||
        orientation === 'LANDSCAPE-LEFT' ||
        orientation === 'LANDSCAPE-RIGHT';
      this.setState({
        orientation: status ? 'horizontal' : 'vertical'
      });
    });
    Orientation.addOrientationListener(this._handleOrientation);

    this._joinConference();

    KeepAwake.activate();
    DeviceEventEmitter.addListener(
      'ON_HOME_BUTTON_PRESSED',
      this._handleEnterPIPMode
    );

    this._timer =
      Platform.OS === 'android' &&
      setInterval(() => {
        this._handleAppSizeChange();
      }, 500);
  }

  /** */
  componentDidUpdate(prevProps) {
    if (prevProps.screenToggleFlag !== this.props.screenToggleFlag && !isIOS) {
      this._handleChangeScreen();
    }
    const { mainUserId, documentShare, list } = this.props;
    if (
      this._conferenceManager &&
      mainUserId &&
      mainUserId !== prevProps.mainUserId
    ) {
      this._conferenceManager.selectParticipant(mainUserId);
    }

    // 드로잉 중에 유저 접속시 실행
    if (
      this._conferenceManager &&
      list.length > 0 &&
      list.length > prevProps.list.length &&
      documentShare.attributes
    ) {
      this._conferenceManager.documentShareTarget(
        list[list.length - 1],
        documentShare
      );
    }
  }

  /**
   * componentWillUnmount
   */
  componentWillUnmount() {
    try {
      const { isConference } = this.props;
      if (isConference) {
        setIsConference(false);
      }
      this._screen = false;
      KeepAwake.deactivate();
      DeviceEventEmitter.removeListener(
        'ON_HOME_BUTTON_PRESSED',
        this._handleEnterPIPMode
      );
      AppState.removeEventListener('change', this._handleAppStateChange);
      this._timer && clearInterval(this._timer);
      // 컴포넌트가 언마운트 되기전 화상회의 관련 리소스를 해제 한다.
      this.ExternalAPI.sendEvent(
        'CONFERENCE_TERMINATED',
        {
          url: null
        },
        this.props.externalAPIScope
      );
      this.eventEmitter.removeAllListeners(
        this.ExternalAPI.TOGGLE_SCREEN_SHARE
      );
      // this._conferenceManager?.dispose();
      this.props.setSharingMode();
      this.connectFailCheck && clearInterval(this.connectFailCheck);
      setConferenceManager(null);
    } catch (error) {}
  }
  /**
   * render
   */
  render() {
    return !this.state.endCall ? (
      <ConferenceScreenPresenter
        {...this.props}
        orientation={this.state.orientation}
        connection={this.state.connection}
        callType={3}
        selectedRoomName={this.state.selectedRoomName}
        pipMode={this.state.pipMode}
        // onBack={this._handleConferenceClose} // 여기서는 단순 뒤로 가는 것이기에... 백으로...
        onClose={this._handleEndCall}
        onClear={this._handleClear}
        onSetDrawingData={this._handleSetDrawingData}
        onChangeDrawingMode={this._handleChangeDrawingMode}
        onChangeSharingMode={this._handleChangeSharingMode}
        onChangeDocumentPage={this._handleChangeDocumentPage}
        onChangeMicMaster={this._handleToggleMic}
        isDeployedServices={this.state.isDeployedServices}
        toggleScreenFlag={this.props.toggleScreenFlag}
      />
    ) : (
      <EndCallMessage
        user={this.state.endUser}
        createdTime={this.state.createdTime}
        onClose={this._handleConferenceClose}
      />
    );
  }

  // toggleScreenFlag = async () => {
  //   const { isDesktopSharing } = this.props;
  //   this.setState({
  //     ...this.state,
  //     isDesktopSharing: !isDesktopSharing
  //   });
  // };

  _handleChangeScreen = async () => {
    const { isScreenShare, setScreenFlag, toggleMuteVideo } = this.props;
    const newTrackType = isScreenShare ? 'video' : 'desktop';
    try {
      await this._conferenceManager.changeTrack(
        newTrackType,
        this.props.user.videoTrack
      );
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
  _handleCreateConnection = () => {
    const { dispatch } = this.props;

    this._conferenceManager = new ConferenceManager(
      dispatch,
      this._handleConferenceClose
    );

    setConferenceManager(this._conferenceManager);
  };

  /** 대화방 참가 생성 */
  _joinConference = async () => {
    const {
      route: { params },
      auth,
      dispatch,
      joinConference,
      changeMasterControlMode,
      setToastMessage,
      setMainUserNotExist,
      isLogin,
      setIsConference,
      setConferenceCreatedTime
    } = this.props;

    const {
      name,
      selectedRoomName,
      id: roomName,
      roomToken: token,
      externalUser,
      tracks
    } = params;

    console.log('params' , params);

    this._conferenceManager = new ConferenceManager(
      dispatch,
      this._handleConferenceClose
    );

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

    const joinResult = await this._conferenceManager.join(
      roomName,
      token,
      tracks,
      sendCommandParams
    );

    if (!joinResult) {
      if (this._screen) {
        this.props.setAlert({
          type: 1,
          title: '알림',
          message: '입장에 실패하였습니다.'
        });
        this._handleConferenceClose();
      }
      return false;
    } else {
      this.eventEmitter.addListener(
        this.ExternalAPI.TOGGLE_SCREEN_SHARE,
        this._handleChangeScreen
      );

      const userId = this._conferenceManager.getMyId();
      MeetApi.enterMeetRoom(token, userId, name);
      setIsConference(true);

      const videoTrack = tracks.find(track => track.getType() === 'video');
      const audioTrack = tracks.find(track => track.getType() === 'audio');
      joinConference({
        cid: userId,
        name,
        videoTrack,
        audioTrack
      });

      const master = await MeetApi.checkMasterControl(roomName);
      const id = master.resultData.videoseq;
      const audioPolicy = master.resultData.audio_active;
      changeMasterControlMode(id);
      this.props.changeAudioActive(id ? !audioPolicy : audioTrack.isMuted());

      setToastMessage(id ? this.t('toast_master_clton') : '');
      this.ExternalAPI.sendEvent(
        'CONFERENCE_JOINED',
        {
          url: `https://video.wehago.com/${roomName}`
        },
        this.props.externalAPIScope
      );
      this.setState({ connection: true, selectedRoomName });

      let roomInfo = auth.cno
        ? await MeetApi.getMeetRoom(auth, roomName)
        : await MeetApi.getMeetRoomNoCert(roomName);
      let { start_datetime } = roomInfo.resultData;

      let cnt = 0;
      while (!start_datetime) {
        roomInfo = auth.cno
          ? await MeetApi.getMeetRoom(auth, roomName)
          : await MeetApi.getMeetRoomNoCert(roomName);
        start_datetime = roomInfo.resultData.start_datetime;
        cnt = cnt + 1;
        cnt > 80 &&
          Alert.alert(
            '네트연결 지연',
            '네트연결 상태가 좋지 않습니다. 회의에 재입장 해주세요.',
            [
              {
                text: '확인',
                onPress: () => {
                  this._handleConferenceClose();
                }
              }
            ]
          );
      }
      setConferenceManager(this._conferenceManager);
      setConferenceCreatedTime(start_datetime);
      setMainUserNotExist();
    }
  };
  _handleOrientation = orientation => {
    const status =
      orientation === 'LANDSCAPE' ||
      orientation === 'LANDSCAPE-LEFT' ||
      orientation === 'LANDSCAPE-RIGHT';
    this.setState({ orientation: status ? 'horizontal' : 'vertical' });
  };

  /** 전화/대화 종료 */
  _handleEndCall = () => {
    const { setScreenFlag, isScreenShare, toggleScreenFlag } = this.props;
    if (isScreenShare) {
      toggleScreenFlag();
      if (isIOS) return;
    }
    this._handleConferenceClose();
  };

  /** 화상회의방 닫기 */
  _handleConferenceClose = async () => {
    const {
      navigation,
      setIndicator,
      initParticipants,
      initMainUser,
      user,
      isLogin,
      resetVideoId,
      setIsConference,
      setConferenceCreatedTime
      // auth,
      // screenProps,
    } = this.props;

    setIndicator();
    initParticipants();
    initMainUser();

    this._conferenceManager.dispose();
    user.videoTrack.dispose();
    user.audioTrack.dispose();
    resetVideoId();
    setIsConference(false);
    setConferenceCreatedTime(null);
    if (!isLogin) {
      navigation.reset({ routes: [{ name: 'LoginStack' }] });
    } else {
      navigation.reset({ routes: [{ name: 'MainStack' }] });
    }
    this.setState({ connection: false, endCall: true });
  };

  _handleAppStateChange = nextAppState => {
    // PIP 모드에서는 appState가 변경되지 않는다.
    // 따라서 아래 로직은 PIP 모드를 지원하지 않을 때 동작한다.

    if (this._appState === 'active' && nextAppState !== 'active') {
      ToastAndroid.show(this.t('toast_background'), ToastAndroid.SHORT);
      if (this.props.isScreenShare) {
      } else {
        // backgroiund 시 video 설정 기억
        if (this.props.user) {
          const { isMuteVideo } = this.props.user;
          this._conferenceState = {
            isMuteVideo
          };
        }
        // 비디오 off
        this.props.toggleMuteVideo(true);
      }
    }
    // else if (this._appState !== 'active' && nextAppState === 'active') {
    //   active 시 video 설정 원래대로
    //   this.props.toggleMuteVideo(this._conferenceState.isMuteVideo);
    // }

    this._appState = nextAppState;
    if (nextAppState === 'active') {
      // active 시 video 설정 원래대로
      this.props.toggleMuteVideo(this._conferenceState.isMuteVideo);

      if (!isIOS) {
        if (this._backTimeout) {
          clearTimeout(this._backTimeout);
        }
      }
    } else {
      // backgroiund 시 video, mic, 설정 기억
      if (this.props.user) {
        const { isMuteVideo, isMuteMic } = this.props.user;
        this._conferenceState = {
          isMuteVideo,
          isMuteMic
        };
      }

      if (!isIOS || !this.props.isScreenShare) {
        this._handleBackgroundWarning();
      }
    }
  };

  /**
   * 백그라운드로 가면 화상회의 Mute 알림을 띄운다. (Android)
   */
  _handleBackgroundWarning = () => {
    if (this._backTimeout) {
      clearTimeout(this._backTimeout);
    }

    ToastAndroid.show(this.t('toast_micwilloff'), ToastAndroid.LONG);

    this._backTimeout = setTimeout(() => {
      this.props.toggleMuteMic(true); // mic mute
      ToastAndroid.show(this.t('toast_micoff'), ToastAndroid.SHORT);
    }, 7500);
    // this.props.toggleMuteMicByMe(true);
  };

  /**
   * _handleAppSizeChange
   */
  _handleAppSizeChange = () => {
    // 기존의 기기 가로,세로와 현재의 가로,세로를 비교하여 PIP MODE 구분
    const { width: pWidth, height: pHeight } = Dimensions.get('window');
    const pipMode = Math.min(width, height) * 0.8 > Math.min(pWidth, pHeight);
    this.setState({ pipMode });
  };

  /**
   * 액티브 모드가 되지 않으면 대화방을 종료한다.
   */
  // _handleCheckKeepRoom = nextAppState => {
  //   if (this._appState !== 'active' && nextAppState !== 'active') {
  //     this._handleEndCall();
  //   }
  // };

  /**
   * _handleSetDrawingData
   * 드로잉데이터 전송
   */
  _handleSetDrawingData = data => {
    this._conferenceManager.setDrawingData(data, this.props.documentShare.page);
  };

  /**
   * _handleSetDocumentPage
   * 페이지 전환 전송
   */
  _handleChangeDocumentPage = (page, presenter) => {
    // this._handleSetDrawingData(); // 페이지 전환 시 드로잉 데이터 삭제
    this._conferenceManager.setDocumentPage(page, presenter);
  };

  /**
   * _handleClear
   * 드로잉데이터 전송
   */
  _handleClear = () => {
    this._conferenceManager.setClear();
  };

  /**
   * _handleChangeDrawingMode
   */
  _handleChangeDrawingMode = isDrawingShare => {
    this._conferenceManager.setDrawingShareMode(isDrawingShare);
  };

  /**
   * _handleChangeSharingMode
   */
  _handleChangeSharingMode = status => {
    this._conferenceManager.setToogleDocumentShare(status);
  };

  _handleEnterPIPMode = () => {
    PictureInPicture.enterPictureInPicture()
      .then(() => this.setState({ pipMode: true }))
      .catch(() => {
        // Picture-in-Picture not supported
      });
  };

  _handleToggleMic = () => {
    console.log('event@@@@@@@@@@@');
    if (this.props.isMuteMic) {
      this._conferenceManager.requestAttention(this.props.user_name);
    } else {
      this._conferenceManager.stopAttention(this.props.user_name);
      // this.props.toggleMuteMic();
      // this.props.toggleMuteMicByMe();
    }
  };
}

export default ConferenceScreenContainer;
