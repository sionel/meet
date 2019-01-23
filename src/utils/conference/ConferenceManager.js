/**
 * 화상대화
 **/
import JitsiMeetJS, {
  JitsiConnectionEvents
} from "../../../jitsi/features/base/lib-jitsi-meet";
import config from "./config";
import { getJitsiMeetGlobalNS } from "../../../jitsi/features/base/util";
import { NativeModules } from "react-native";
import Connection from "./Connection";
import ConferenceConnector from "./ConferenceConnector";

/**
 * ConferenceManager 화상대화 접속을 총괄하는 매니저
 */
class ConferenceManager {
  constructor() {
    // 대화방 연결을 위한 Connection
    this._connection = new Connection();
    // 대화방 연결을 위한 ConferenceConnector
    this._conferenceConnector = new ConferenceConnector();
    // 초기화
    this._init();
  }

  // #region Public Functions

  /**
   * connect : 화상대화 연결
   */
  connect = async (roomName, name) => {
    // connection 연결
    await this._connection.connect(roomName);
    // 대화방 참가
    await this._conferenceConnector.connect(
      this._connection,
      roomName,
      name
    );
  };

  /**
   * 연결을 해제한다.
   */
  dispose = async () => {
    await this._conferenceConnector.dispose();
    this._connection.dispose();
  };

  /**
   * 로컬 트랙을 가져온다.
   */
  getLocalTracks = () => {
    return this._conferenceConnector.tracks;
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
