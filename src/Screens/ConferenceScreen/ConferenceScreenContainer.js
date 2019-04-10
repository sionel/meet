/**
 * ConferenceScreenContainer
 * 화상대화 화면 컨테이너
 */

import React, { Fragment } from 'react';
import { NativeModules } from 'react-native';
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
      callType: 1
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
    this.callType = item.callType;
    // 컴포넌트가 마운트 되면 대화방 초기 설정 후 입장한다.
    this._conferenceManager = new ConferenceManager(this.props.dispatch, {
      token: auth.AUTH_A_TOKEN,
      r_token: auth.AUTH_R_TOKEN,
      HASH_KEY: auth.HASH_KEY
    });

    // 참가자/생성자 여부 확인 후 로딩딜레이
    const delayLoading = time =>
      setTimeout(() => {
        this._joinConference(item.videoRoomId, user_name, auth);
        AppState.addEventListener('change', this._handleAppStateChange);
      }, time);

    if (item.isCreator == 2) {
      delayLoading(4500);
    } else {
      delayLoading(0);
    }
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
  }

  /**
   * render
   */
  render() {
    return (
      <Fragment>
        {/* <StatusBar barStyle="light-content" /> */}
        <StatusBar hidden={true} />
        <ConferenceScreenPresenter
          {...this.props}
          callType={this.callType}
          onClose={this._handleClose}
        />
      </Fragment>
    );
  }

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
}

export default ConferenceScreenContainer;
