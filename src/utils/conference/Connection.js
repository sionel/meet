/**
 * Connection
 **/
import JitsiMeetJS, {
  JitsiConnectionEvents
} from '../../../jitsi/features/base/lib-jitsi-meet';
import config from './config';

class Connection {
  /**
   * constructor : 클래스 변수를 초기화 한다.
   */
  constructor() {
    // Jitsi Connection
    this._jitsiConnection = null;
  }

  /**
   * getter
   */
  get jitsiConnection() {
    return this._jitsiConnection;
  }

  //#region Public Functions

  /**
   * Connection을 연결한다.
   */
  connect = async (roomName, handleClose, token) => {
    return new Promise((resolve, reject) => {
      // jitsi connection 을 생성한다.
      this._jitsiConnection = this._creaeteJitsiConnection(roomName, token);
      // 이벤트를 바인딩한다. -> 바인딩된 이벤트가 호출되어야지 프라미스가 종료된다.
      this._bindEvents(this.jitsiConnection, resolve, reject, handleClose);
      // 커넥션을 연결한다.
      this._jitsiConnection.connect({});
    });
  };

  /**
   * 연결을 해제한다.
   */
  dispose = () => {
    if (this._jitsiConnection) {
      this._jitsiConnection.disconnect();
    }
  };

  //#endregion

  //#region Private Functions

  /**
   * creaeteJitsiConnection : jitsiConnection 을 생성한다.
   */
  _creaeteJitsiConnection = (roomName, token) => {
    const options = Object.assign({}, config);
    options.bosh = `https:${options.bosh}?room=${roomName}`;
    const jitsiConnection = new JitsiMeetJS.JitsiConnection(
      null,
      token ? token : null,
      options
    );
    return jitsiConnection;
  };

  /**
   * 이벤트를 연결한다.
   */
  _bindEvents = (jitsiConnection, resolve, reject, handleClose) => {
    // 커넥션 연결 성공시 발생하는 이벤트 바인딩
    jitsiConnection.addEventListener(
      JitsiConnectionEvents.CONNECTION_ESTABLISHED,
      resolve
    );

    // 연결 실패 이벤트 바인딩
    jitsiConnection.addEventListener(
      JitsiConnectionEvents.CONNECTION_FAILED,
      handleClose
    );

    // CONNECTION_DISCONNECTED
    jitsiConnection.addEventListener(
      JitsiConnectionEvents.CONNECTION_DISCONNECTED,
      handleClose
    );
  };
  //#endregion
}

export default Connection;
