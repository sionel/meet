/**
 * Connection
 **/
import JitsiMeetJS, { JitsiConnectionEvents } from '@jitsi/base/lib-jitsi-meet';
import config from './config';

class Connection {
  private _jitsiConnection = null;
  constructor() {
    this._jitsiConnection;
  }

  get jitsiConnection() {
    return this._jitsiConnection;
  }

  connect = async (roomName, token) => {
    return new Promise((resolve, reject) => {
      // jitsi connection 을 생성한다.
      this._jitsiConnection = this._creaeteJitsiConnection(roomName, token);
      // 이벤트를 바인딩한다. -> 바인딩된 이벤트가 호출되어야지 프라미스가 종료된다.
      this._bindEvents(this._jitsiConnection, resolve, reject);
      // 커넥션을 연결한다.
      this._jitsiConnection.connect({});
    });
  };

  dispose = () => {
    if (this._jitsiConnection) {
      this._jitsiConnection.disconnect();
    }
  };

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

  _bindEvents = (jitsiConnection, resolve, reject) => {
    // 커넥션 연결 성공시 발생하는 이벤트 바인딩
    jitsiConnection.addEventListener(
      JitsiConnectionEvents.CONNECTION_ESTABLISHED,
      resolve
    );

    // 연결 실패 이벤트 바인딩
    jitsiConnection.addEventListener(
      JitsiConnectionEvents.CONNECTION_FAILED,
      reject
    );

    // CONNECTION_DISCONNECTED
    jitsiConnection.addEventListener(
      JitsiConnectionEvents.CONNECTION_DISCONNECTED,
      reject
    );
  };
}

export default Connection;
