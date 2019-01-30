/**
 * 화상대화
 **/
import JitsiMeetJS from "../../../jitsi/features/base/lib-jitsi-meet";
import config from "./config";
import Connection from "./Connection";
import ConferenceConnector from "./ConferenceConnector";
import { actionCreators as localActionCreators } from "../../redux/modules/local";
import { actionCreators as mainUserActionCreators } from "../../redux/modules/mainUser";
import { actionCreators as participantsAcionCreators } from "../../redux/modules/participants";

/**
 * ConferenceManager 화상대화 접속을 총괄하는 매니저
 */
class ConferenceManager {
  constructor(dispatch) {
    // Singleton
    if (!ConferenceManager.instance) {
      // 싱글톤 변수 할당
      ConferenceManager.instance = this;
      this._dispatch = dispatch;
    }
    return ConferenceManager.instance;
  }

  // #region Public Functions

  /**
   * connect : 화상대화 참가
   */
  join = async (roomName, name) => {
    // 초기화
    this._init();
    // 대화방 연결을 위한 Connection
    this._connection = new Connection();
    // 대화방 연결을 위한 ConferenceConnector
    this._conferenceConnector = new ConferenceConnector(this._createHandlers());
    // connection 연결
    await this._connection.connect(roomName);
    // 대화방 참가
    await this._conferenceConnector.connect(
      this._connection,
      roomName,
      name
    );
    const id = "localUser";
    const tracks = this._conferenceConnector.tracks;
    const videoTrack = tracks.find(track => track.getType() === "video");
    const audioTrack = tracks.find(track => track.getType() === "audio");
    await this._dispatch(
      localActionCreators.joinConference({
        id,
        name,
        videoTrack,
        audioTrack
      })
    );
    this._dispatch(mainUserActionCreators.setMainUser(id));
  };

  /**
   * 연결을 해제한다.
   */
  dispose = async () => {
    if (this._conferenceConnector) {
      await this._conferenceConnector.dispose();
    }
    if (this._connection) {
      this._connection.dispose();
    }
    this._dispatch(localActionCreators.leaveConference());
  };

  /**
   * selectParticipant
   * 메인으로 선택된 사람의 화질을 높인다.
   */
  selectParticipant = id => {
    this._conferenceConnector.selectParticipant(id);
  };

  // #endregion

  /**
   * init: 화상대화 연결을 위한 초기화
   */
  _createHandlers = () => {
    const handler = {
      JOIN_USER: this._joinUser,
      LEFT_USER: this._leftUser,
      ADD_REMOTE_TRACK: this._addRemoteTrack
    };
    return handler;
  };

  /**
   * init: 화상대화 연결을 위한 초기화
   */
  _init = () => {
    // JitsiMeetJS 를 초기화 한다.
    JitsiMeetJS.init({
      ...config
    });

    // JitsiMeetJS Log Level을 설정한다.
    JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);
  };

  /**
   * JOIN_USER
   * 대화방에 참여자가 접속하면 호출된다.
   */
  _joinUser = user => {
    this._dispatch(participantsAcionCreators.joinUser(user));
  };

  /**
   * LEFT_USER
   * 대화방에 참여자가 나가면 호출된다.
   */
  _leftUser = id => {
    this._dispatch(participantsAcionCreators.leftUser(id));
  };

  /**
   * ADD_REMOTE_TRACK
   * 대화방에 참여자의 트랙이 추가되면 호출된다.
   */
  _addRemoteTrack = track => {
    this._dispatch(participantsAcionCreators.setRemoteTrack(track));
  };
}

export default ConferenceManager;