/**
 * ConferenceScreenContainer
 * 화상대화 화면 컨테이너
 */

import React from 'react';
import {
  AppState,
  DeviceEventEmitter,
  NativeModules,
  Platform,
  Dimensions,
  ToastAndroid
} from 'react-native';
import KeepAwake from 'react-native-keep-awake';
import ConferenceScreenPresenter from './ConferenceScreenPresenter';
import EndCallMessage from './EndCallMessage';
import ConferenceManager from '../../utils/conference/ConferenceManager';
// import { AppState } from 'react-native';
const { PictureInPicture } = NativeModules;
const { width, height } = Dimensions.get('window');

class ConferenceScreenContainer extends React.Component {
  constructor() {
    super();
    this._appState = 'active';
    this._conferenceState = {
      isMuteVideo: false
    };
    this.state = {
      callType: 3,
      connection: false,
      selectedRoomName: '',
      endCall: false,
      endUser: null,
      createdTime: null,
      pipMode: false
    };
  }

  /**
   * componentDidMount
   */
  componentDidMount() {
    const { navigation, user_name, auth, dispatch } = this.props;
    this._handleCreateConnection(navigation, user_name, auth, dispatch);

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

  shouldComponentUpdate(nextProps, nextState) {
    // 상대방이 통화를 종료했는지 확인
    if (this.callType !== 3) {
      if (nextState.connection && !this.state.connection) {
        this.connectFailCheck && clearInterval(this.connectFailCheck);
        setTimeout(() => {
          this.connectFailCheck = setInterval(() => {
            const endUser = this.props.list;
            // 대기하고 있는데 사용자가 들어온 경우
            if (endUser.length > 0 && !this.state.endUser) {
              this.setState({
                endUser: endUser[0],
                createdTime: this.props.createdTime
              });
              return false;
            }
            // 대기하고 있는데 사용자가 안들어올 경우
            if (endUser.length === 0 && !this.state.endUser) {
              clearInterval(this.connectFailCheck);
              this._conferenceManager && this._conferenceManager.dispose();
              // this._handleConferenceClose();
              this.setState({ endCall: true });
              return false;
            }
            // 통화 중에 사용자가 종료했을 경우
            if (endUser.length === 0 && this.state.endUser) {
              clearInterval(this.connectFailCheck);
              this._conferenceManager && this._conferenceManager.dispose();
              this.setState({ endCall: true });
              return false;
            }
          }, 100);
        }, 3000);
      }
    }

    // 통화종료 안내화면에서 전화를 받았을 때
    // Connection 을 새로 생성하고 연결한다.
    const { navigation: nav1 } = this.props;
    const { navigation: nav2 } = nextProps;
    const item1 = nav1.getParam('item');
    const item2 = nav2.getParam('item');
    if (item1 !== item2) {
      this.setState({ endCall: false, endUser: null, connection: false });
      const { navigation, user_name, auth, dispatch } = nextProps;
      this._handleCreateConnection(navigation, user_name, auth, dispatch);
      return false;
    }

    if (this.state.endCall) return false;
    if (this.props !== nextProps) return true;
    if (this.state !== nextState) return true;
    return false;
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
    DeviceEventEmitter.removeListener(
      'ON_HOME_BUTTON_PRESSED',
      this._handleEnterPIPMode
    );
    AppState.removeEventListener('change', this._handleAppStateChange);
    this._timer && clearInterval(this._timer);

    // 컴포넌트가 언마운트 되기전 화상회의 관련 리소스를 해제 한다.
    this._conferenceManager.dispose();
    this.props.setSharingMode();
    this.connectFailCheck && clearInterval(this.connectFailCheck);
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
        pipMode={this.state.pipMode}
        // onClose={this._handleConferenceClose}
        onClose={this._handleEndCall}
        onClear={this._handleClear}
        onSetDrawingData={this._handleSetDrawingData}
        onChangeDrawingMode={this._handleChangeDrawingMode}
        onChangeSharingMode={this._handleChangeSharingMode}
        onChangeDocumentPage={this._handleChangeDocumentPage}
      />
    ) : (
      <EndCallMessage
        user={this.state.endUser}
        createdTime={this.state.createdTime}
        onClose={this._handleConferenceClose}
      />
    );
  }

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
    const delayLoading = time => {
      this.delayLoading && clearTimeout(this.delayLoading);
      this.delayLoading = setTimeout(() => {
        const roomId = item.videoRoomId; // item.videoRoomId
        this._joinConference(roomId, user_name, auth);

        Platform.OS === 'android' &&
          AppState.addEventListener('change', this._handleAppStateChange);
      }, time);
    };

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
    this.setState({ connection: true });
  };

  /** 전화/대화 종료 */
  _handleEndCall = () => {
    if (this.callType === 3) this._handleConferenceClose();
    else {
      this._conferenceManager && this._conferenceManager.dispose();
    }
    this.setState({ connection: false, endCall: true });
  };

  /** 화상대화방 닫기 */
  _handleConferenceClose = () => {
    const { goBack } = this.props.navigation;
    goBack();
  };

  /**
   * _handleAppStateChange
   * 앱 슬립모드를 감지한다.
   */
  _handleAppStateChange = nextAppState => {
    // PIP 모드에서는 appState가 변경되지 않는다.
    // 따라서 아래 로직은 PIP 모드를 지원하지 않을 때 동작한다.
    if (this._appState === 'active' && nextAppState !== 'active') {
      // this.setState({ pipMode: false });
      ToastAndroid.show('백그라운드에서 실행됩니다.', ToastAndroid.SHORT);
      // backgroiund 시 video 설정 기억
      if (this.props.user) {
        const { isMuteVideo } = this.props.user;
        this._conferenceState = {
          isMuteVideo
        };
      }
      // 비디오 off
      this.props.toggleMuteVideo(true);
    } else if (this._appState !== 'active' && nextAppState === 'active') {
      // active 시 video 설정 원래대로
      this.props.toggleMuteVideo(this._conferenceState.isMuteVideo);
    }
    this._appState = nextAppState;
    // setTimeout(() => {
    //   this._handleCheckKeepRoom(nextAppState);
    // }, 10000);
  };
  /**
   * _handleAppSizeChange
   */
  _handleAppSizeChange = () => {
    // 기존의 기기 가로,세로와 현재의 가로,세로를 비교하여 PIP MODE 구분
    const { width: pWidth, height: pHeight } = Dimensions.get('window');
    const pipMode = Math.min(width, height) > Math.min(pWidth, pHeight);
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
  _handleChangeDrawingMode = value => {
    this._conferenceManager.setDrawingData(value);
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
}

export default ConferenceScreenContainer;
