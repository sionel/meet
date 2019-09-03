/**
 * ConferenceScreenContainer
 * 화상대화 화면 컨테이너
 */

import React, { Fragment } from 'react';
import { NativeModules, NetInfo } from 'react-native';
import KeepAwake from 'react-native-keep-awake';
import ConferenceScreenPresenter from './ConferenceScreenPresenter';
import EndCallMessage from './EndCallMessage';
import ConferenceManager from '../../utils/conference/ConferenceManager';
// import Orientation from 'react-native-orientation-locker';
import { AppState, StatusBar } from 'react-native';

const { PlatformConstants } = NativeModules;

class ConferenceScreenContainer extends React.Component {
  constructor() {
    super();
    this._appState = 'active';
    this.state = {
      callType: 3,
      connection: true,
      selectedRoomName: '',
      endCall: false
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

    const { navigation, user_name, auth, dispatch } = this.props;
    this._handleCreateConnection(navigation, user_name, auth, dispatch);

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

  shouldComponentUpdate(nextProps, nextState) {
    // if (!this.state.endCall === nextState.endCall) return false;
    if (
      this.callType != 3 &&
      this.props.list.length > 0 &&
      nextProps.list.length === 0
    ) {
      this._conferenceManager && this._conferenceManager.dispose();
      this.setState({ endCall: true });
      return false;
    }

    const { navigation: nav1 } = this.props;
    const { navigation: nav2 } = nextProps;
    const item1 = nav1.getParam('item');
    const item2 = nav2.getParam('item');
    if (item1 !== item2) {
      this.setState({ endCall: false });
      const { navigation, user_name, auth, dispatch } = nextProps;
      this._handleCreateConnection(navigation, user_name, auth, dispatch);
    }

    return true;
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
    // clearTimeout(this._end);
    KeepAwake.deactivate();
    // Orientation.lockToPortrait();
    // 컴포넌트가 언마운트 되기전 화상회의 관련 리소스를 해제 한다.
    this._conferenceManager.dispose();
    this.props.setSharingMode();
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
    return !this.state.endCall ? (
      <ConferenceScreenPresenter
        {...this.props}
        connection={this.state.connection}
        callType={this.callType}
        selectedRoomName={this.selectedRoomName}
        // onClose={this._handleConferenceClose}
        onClose={this._handleEndCall}
        onClear={this._handleClear}
        onSetDrawingData={this._handleSetDrawingData}
        onChangeDrawingMode={this._handleChangeDrawingMode}
        onChangeSharingMode={this._handleChangeSharingMode}
        onChangeDocumentPage={this._handleChangeDocumentPage}
      />
    ) : (
      <EndCallMessage onClose={this._handleConferenceClose} />
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

  _handleCreateConnection = (navigation, user_name, auth, dispatch) => {
    // const { navigation, user_name, auth, dispatch } = this.props;
    const item = navigation.getParam('item');
    // 전화 타입 - 화상:1 / 음성:2 / 위톡:3
    this.callType = item.callType || this.state.callType;
    this.selectedRoomName = item.selectedRoomName;
    // 컴포넌트가 마운트 되면 대화방 초기 설정 후 입장한다.
    this._conferenceManager = new ConferenceManager(dispatch, {
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
        // AppState.addEventListener('change', this._handleAppStateChange);
      }, time);

    if (item.isCreator == 2) {
      delayLoading(4500);
    } else {
      delayLoading(0);
    }

    this.setState({ selectedRoomName: this.selectedRoomName });
  };

  /** 대화방 참가 생성 */
  _joinConference = async (roomName, name, auth) => {
    await this._conferenceManager.join(
      roomName,
      name,
      // this._handleEndCall,
      () => {},
      auth,
      this.callType
    );
  };

  /** 전화/대화 종료 */
  _handleEndCall = () => {
    if (this.callType === 3) this._handleConferenceClose();
    else {
      this._conferenceManager && this._conferenceManager.dispose();
    }
  };

  /** 화상대화방 닫기 */
  _handleConferenceClose = () => {
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
      this._handleEndCall();
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
