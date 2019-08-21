/**
 * ConferenceScreenContainer
 * 화상대화 화면 컨테이너
 */

import React, { Fragment } from 'react';
import { NativeModules, NetInfo, ToastAndroid, Platform } from 'react-native';
import KeepAwake from 'react-native-keep-awake';
import ConferenceScreenPresenter from './ConferenceScreenPresenter';
import ConferenceManager from '../../utils/conference/ConferenceManager';
// import Orientation from 'react-native-orientation-locker';
import { AppState, StatusBar } from 'react-native';
import SystemSetting from 'react-native-system-setting';

const { PlatformConstants } = NativeModules;
const isIOS = Platform.OS === 'ios';

class ConferenceScreenContainer extends React.Component {
  constructor() {
    super();
    this._appState = 'active';
    this._backTimeout = null;
    this._conferenceState = {
      isMuteVideo: false,
      isMuteMic: false,
      isMuteSpeaker: false,
      volume: 0
    };
    this.state = {
      callType: 1,
      connection: true,
      selectedRoomName: ''
    };
  }

  /**
   * componentDidMount
   */
  componentDidMount() {
    KeepAwake.activate();
    // if (PlatformConstants.interfaceIdiom === 'phone') Orientation.unlockAllOrientations();
    // else {
    // 	Orientation.lockToPortrait();
    // }
    const { navigation, user_name, auth } = this.props;
    const item = navigation.getParam('item');
    // 전화 타입 - 화상:1 / 음성:2
    this.callType = item.callType || this.state.callType;
    this.selectedRoomName = item.selectedRoomName;
    // 컴포넌트가 마운트 되면 대화방 초기 설정 후 입장한다.
    this._conferenceManager = new ConferenceManager(this.props.dispatch, {
      token: auth.AUTH_A_TOKEN,
      r_token: auth.AUTH_R_TOKEN,
      HASH_KEY: auth.HASH_KEY
    });

    // 참가자/생성자 여부 확인 후 로딩딜레이
    const delayLoading = time =>
      setTimeout(() => {
        const roomId = item.videoRoomId; // item.videoRoomId
        // const roomId = `OGrTxmgBeAtpuzEuupv9_20190426092958yf656`; // item.videoRoomId
        this._joinConference(roomId, user_name, auth);
        AppState.addEventListener('change', this._handleAppStateChange);
      }, time);

    if (item.isCreator == 2) {
      delayLoading(4500);
    } else {
      delayLoading(0);
    }

    this.setState({ selectedRoomName: this.selectedRoomName });

    // NetInfo.getConnectionInfo().then(connectionInfo => {
    //   this.setState({
    //     connection:
    //       connectionInfo.type !== 'wifi' || connectionInfo.type !== 'cellular'
    //   });
    //   console.log('Initial, type: ' + connectionInfo.type);
    // });

    // NetInfo.addEventListener(
    //   'connectionChange',
    //   this._handleConnectivityChange
    // );
  }

  /** */
  componentDidUpdate(prevProps) {
    const { mainUserId, documentShare, list } = this.props;
    if (
      this._conferenceManager &&
      mainUserId &&
      mainUserId !== prevProps.mainUserId
    ) {
      const conferenceManager = new ConferenceManager();
      conferenceManager.selectParticipant(mainUserId);
    }

    // 드로잉 중에 유저 접속시 실행
    if (
      this._conferenceManager &&
      list.length > 0 &&
      list.length > prevProps.list.length &&
      documentShare.attributes
    ) {
      const conferenceManager = new ConferenceManager();
      conferenceManager.documentShareTarget(
        list[list.length - 1],
        documentShare
      );
    }
  }

  /**
   * componentWillUnmount
   */
  componentWillUnmount() {
    KeepAwake.deactivate();
    AppState.removeEventListener('change', this._handleAppStateChange);
    // Orientation.lockToPortrait();
    // 컴포넌트가 언마운트 되기전 화상회의 관련 리소스를 해제 한다.
    this._conferenceManager.dispose();
    // this.props.navigation.navigate('Home');

    // NetInfo.removeEventListener(
    //   'connectionChange',
    //   this._handleConnectivityChange
    // );
  }

  /**
   * render
   */
  render() {
    return (
      <ConferenceScreenPresenter
        {...this.props}
        connection={this.state.connection}
        callType={this.callType}
        selectedRoomName={this.selectedRoomName}
        onClose={this._handleClose}
        onClear={this._handleClear}
        onSetDrawingData={this._handleSetDrawingData}
        onChangeDrawingMode={this._handleChangeDrawingMode}
        onChangeSharingMode={this._handleChangeSharingMode}
        onChangeDocumentPage={this._handleChangeDocumentPage}
      />
    );
  }

  // _handleConnectivityChange = connectionInfo => {
  //   console.log('Network change, type: ' + connectionInfo.type);

  //   if (connectionInfo.type !== 'wifi' || connectionInfo.type !== 'cellular') {
  //     this.setState({ connection: false });
  //     this._conferenceManager.dispose();
  //   }
  //   // if (connectionInfo.type !== this.state.connection && connectionInfo.type) {
  //   // }
  // };

  /** 대화방 참가 생성 */
  _joinConference = async (roomName, name, auth) => {
    await this._conferenceManager.join(roomName, name, this._handleClose, auth);
  };

  /** 화상대화방 닫기 */
  _handleClose = () => {
    const { goBack } = this.props.navigation;
    goBack();
  };

  /**
   * 앱 백그라운드 모드를 감지한다.
   */
  _handleAppStateChange = nextAppState => {
    this._appState = nextAppState;
    if (nextAppState === 'active') {
      // active 시 video 설정 원래대로
      this.props.toggleMuteVideo(this._conferenceState.isMuteVideo);

      if (!isIOS) {
        // mic 설정 원래대로
        this.props.toggleMuteMic(this._conferenceState.isMuteMic);

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

      // 비디오 off
      this.props.toggleMuteVideo(true);

      // SystemSetting.getVolume().then(volume => {
      //   this._conferenceState.volume = volume;
      // });

      if (!isIOS) {
        this._handleBackgroundWarning();
      }
    }
  };

  /**
   * 백그라운드로 가면 화상대화 Mute 알림을 띄운다. (Android)
   */
  _handleBackgroundWarning = () => {
    if (this._backTimeout) {
      clearTimeout(this._backTimeout);
    }

    ToastAndroid.show(
      '앱으로 돌아가지 않으면 잠시후 마이크가 꺼집니다.',
      ToastAndroid.LONG
    );

    this._backTimeout = setTimeout(() => {
      this.props.toggleMuteMic(true); // mic mute
      ToastAndroid.show('마이크가 꺼졌습니다.', ToastAndroid.SHORT);
    }, 7500);
  };

  /**
   * 액티브 모드가 되지 않으면 대화방을 종료한다.
   */
  _handleCheckKeepRoom = nextAppState => {
    if (this._appState !== 'active' && nextAppState !== 'active') {
      this._handleClose();
    }
  };

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
  _handleChangeDrawingMode = value => {
    this._conferenceManager.setDrawingData(value);
  };

  /**
   * _handleChangeSharingMode
   */
  _handleChangeSharingMode = status => {
    this._conferenceManager.setToogleDocumentShare(status);
  };
}

export default ConferenceScreenContainer;
