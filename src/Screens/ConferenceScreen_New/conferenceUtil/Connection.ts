/**
 * Connection
 **/
import JitsiMeetJS, { JitsiConnectionEvents } from '@jitsi/base/lib-jitsi-meet';
import config from './config';

class Connection {
  private _jitsiConnection: any = null;
  constructor() {
    this._jitsiConnection;
  }

  get jitsiConnection() {
    return this._jitsiConnection;
  }

  public connect = (roomId: string, roomToken: string) =>
    new Promise((resolve, reject) => {
      // jitsi connection 을 생성한다.
      const jitsiConnection = this._creaeteJitsiConnection(roomId, roomToken);
      // 이벤트를 바인딩한다. -> 바인딩된 이벤트가 호출되어야지 프라미스가 종료된다.
      this._bindEvents(jitsiConnection, resolve, reject);
      // 커넥션을 연결한다.
      jitsiConnection.connect({});
    });

  dispose = () => {
    if (this._jitsiConnection) {
      this._jitsiConnection.disconnect();
    }
  };

  _creaeteJitsiConnection = (roomId: string, roomToken: string) => {
    const options = { ...config };
    options.bosh = `https:${options.bosh}?room=${roomId}`;
    const jitsiConnection = new JitsiMeetJS.JitsiConnection(
      null,
      roomToken ? roomToken : null,
      options
    );
    this._jitsiConnection = jitsiConnection;
    return jitsiConnection;
  };

  _bindEvents = (
    jitsiConnection: any,
    resolve: (value?: unknown) => void,
    reject: (reason?: any) => void
  ) => {
    // 커넥션 연결 성공시 발생하는 이벤트 바인딩
    jitsiConnection.addEventListener(
      JitsiConnectionEvents.CONNECTION_ESTABLISHED,
      resolve
    );

    // 연결 실패 이벤트 바인딩
    jitsiConnection.addEventListener(
      JitsiConnectionEvents.CONNECTION_FAILED,
      () => {
        this.dispose();
        reject('화상 연결에 실패하였습니다.');
      }
    );

    // CONNECTION_DISCONNECTED
    jitsiConnection.addEventListener(
      JitsiConnectionEvents.CONNECTION_DISCONNECTED,
      () => {
        this.dispose();
        reject('Connection  - 화상 연결에 실패하였습니다.');
      }
    );
  };
}

export default Connection;
