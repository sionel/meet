/**
 * 화상대화
 **/
import JitsiMeetJS from "../../../jitsi/features/base/lib-jitsi-meet";
import config from "./config";
import Connection from "./Connection";
import ConferenceConnector from "./ConferenceConnector";
import { actionCreators as localActoinCreators } from "../../redux/modules/local";
import { actionCreators as mainUserActoinCreators } from "../../redux/modules/mainUser";

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
    this._conferenceConnector = new ConferenceConnector();
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
      localActoinCreators.joinConference({
        id,
        videoTrack,
        audioTrack
      })
    );
    this._dispatch(mainUserActoinCreators.setMainUser(id));
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
    this._dispatch(localActoinCreators.leaveConference());
  };

  // #endregion

  /**
   * init: 화상대화 연결을 위한 초기화
   */
  _init() {
    // JitsiMeetJS 를 초기화 한다.
    JitsiMeetJS.init({
      ...config
    });

    // JitsiMeetJS Log Level을 설정한다.
    JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);
  }
}

export default ConferenceManager;
