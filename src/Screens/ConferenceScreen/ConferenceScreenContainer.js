/**
 * ConferenceScreenContainer
 * 화상대화 화면 컨테이너
 */

import React, { Fragment } from "react";
import ConferenceScreenPresenter from "./ConferenceScreenPresenter";
import ConferenceManager from "../../utils/conference/ConferenceManager";
import Orientation from "react-native-orientation-locker";
import { AppState, StatusBar } from "react-native";

class ConferenceScreenContainer extends React.Component {
  constructor() {
    super();
    this._appState = "active";
  }
  componentWillMount() {
    Orientation.unlockAllOrientations();
  }

  /**
   * componentDidMount
   */
  componentDidMount() {
    const { navigation, user_name, portal_id } = this.props;
    const item = navigation.getParam("item");
    // 컴포넌트가 마운트 되면 대화방 초기 설정 후 입장한다.
    this._conferenceManager = new ConferenceManager(this.props.dispatch);
    this._joinConference(item.videoRoomId, user_name, portal_id);
    AppState.addEventListener("change", this._handleAppStateChange);
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
    Orientation.lockToPortrait();
    // 컴포넌트가 언마운트 되기전 화상회의 관련 리소스를 해제 한다.
    this._conferenceManager.dispose();
  }

  /**
   * render
   */
  render() {
    return (
      <Fragment>
        <StatusBar barStyle="light-content" />
        <ConferenceScreenPresenter
          {...this.props}
          onClose={this._handleClose}
        />
      </Fragment>
    );
  }

  /** 대화방 참가 생성 */
  _joinConference = async (roomName, name, portal_id) => {
    await this._conferenceManager.join(
      roomName,
      name,
      this._handleClose,
      portal_id
    );
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
    if (this._appState !== "active" && nextAppState !== "active") {
      this._handleClose();
    }
  };
}

export default ConferenceScreenContainer;
