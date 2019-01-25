/**
 * ConferenceScreenContainer
 * 화상대화 화면 컨테이너
 */

import React from "react";
import ConferenceScreenPresenter from "./ConferenceScreenPresenter";
import ConferenceManager from "../../utils/conference/ConferenceManager";

const roomName = "abcdd";
const name = "김더존";

class ConferenceScreenContainer extends React.Component {
  /**
   * componentDidMount
   */
  componentDidMount() {
    // 컴포넌트가 마운트 되면 대화방 초기 설정 후 입장한다.
    this._conferenceManager = new ConferenceManager(this.props.dispatch);
    this._joinConference(roomName, name);
  }

  /**
   * componentWillUnmount
   */
  componentWillUnmount() {
    // 컴포넌트가 언마운트 되기전 화상회의 관련 리소스를 해제 한다.
    this._conferenceManager.dispose();
  }

  /**
   * render
   */
  render() {
    console.log(this.props);
    return (
      <ConferenceScreenPresenter {...this.props} onClose={this._handleClose} />
    );
  }

  /** 대화방 참가 생성 */
  _joinConference = async (roomName, name) => {
    await this._conferenceManager.join(roomName, name);
  };

  /** 화상대화방 닫기 */
  _handleClose = () => {
    const { goBack } = this.props.navigation;
    goBack();
  };
}

export default ConferenceScreenContainer;
