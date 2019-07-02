/**
 * ConferenceScreenContainer
 * 화상대화 화면 컨테이너
 */

import React, { Fragment } from 'react';
import { NativeModules, NetInfo } from 'react-native';
import ConferenceScreenPresenter from './ConferenceScreenPresenter';
import ConferenceManager from '../../utils/conference/ConferenceManager';
// import Orientation from 'react-native-orientation-locker';
import { AppState, StatusBar } from 'react-native';

const { PlatformConstants } = NativeModules;

class ConferenceScreenContainer extends React.Component {
  constructor() {
    super();
    this._appState = 'active';
    this.state = {
      callType: 1,
      connection: true
    };
  }

  /**
   * componentDidMount
   */
  componentDidMount() {
    // if (PlatformConstants.interfaceIdiom === 'phone') Orientation.unlockAllOrientations();
    // else {
    // 	Orientation.lockToPortrait();
    // }
    const { navigation, user_name, auth } = this.props;
    const item = navigation.getParam('item');
    // 전화 타입 - 화상:1 / 음성:2
    this.callType = item.callType || this.state.callType;
    this.selectedRoomName = item.selectedRoom;
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
    const { mainUserId } = this.props;
    if (
      this._conferenceManager &&
      mainUserId &&
      mainUserId !== prevProps.mainUserId
    ) {
      const conferenceManager = new ConferenceManager();
      conferenceManager.selectParticipant(mainUserId);
    }
  }

  /**
   * componentWillUnmount
   */
  componentWillUnmount() {
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
   * 앱 슬립모드를 감지한다.
   */
  _handleAppStateChange = nextAppState => {
    this._appState = nextAppState;
    setTimeout(() => {
      this._handleCheckKeepRoom(nextAppState);
    }, 10000);
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
    this._conferenceManager.setDrawingData(data);
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
  _handleChangeSharingMode = value => {
    this._conferenceManager.setToogleDocumentShare(value);
  };
}

export default ConferenceScreenContainer;
