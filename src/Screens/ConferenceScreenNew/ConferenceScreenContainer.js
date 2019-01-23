/**
 * ConferenceScreenContainer
 * 화상대화 화면 컨테이너
 */

import React from "react";
import ConferenceScreenPresenter from "./ConferenceScreenPresenter";
import ConferenceManager from "../../utils/conference/ConferenceManager";

class ConferenceScreenContainer extends React.Component {
  /**
   * constructor
   */
  constructor(params) {
    super(params);
    // 대화방 화면으로 전환되면 대화방 초기 설정 후 입장한다.
    this._conferenceManager = new ConferenceManager();
  }

  state = {
    participants: []
  };

  /**
   * componentDidMount
   */
  componentDidMount() {
    const roomName = "abcdd";
    const name = "김더존";
    this._connectConference(roomName, name);
  }

  /**
   * componentWillUnmount
   */
  componentWillUnmount() {
    this._conferenceManager.dispose();
  }

  /**
   * render
   */
  render() {
    const { participants } = this.state;
    return (
      <ConferenceScreenPresenter {...this.props} participants={participants} />
    );
  }

  /** 커넥션 생성 */
  _connectConference = async (roomName, name) => {
    await this._conferenceManager.connect(
      roomName,
      name
    );
    setTimeout(() => {
      const tracks = this._conferenceManager.getLocalTracks();
      console.log(tracks);
      this.setState({
        participants: [
          {
            id: "duzon",
            name: "김더존",
            tracks
          }
        ]
      });
    }, 3000);
  };
}

export default ConferenceScreenContainer;
