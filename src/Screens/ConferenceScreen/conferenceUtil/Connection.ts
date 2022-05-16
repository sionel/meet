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
      this._jitsiConnection = this._creaeteJitsiConnection(roomId, roomToken);
      this._bindEvents(resolve, reject);
      this._jitsiConnection.connect({});
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
    return jitsiConnection;
  };

  _bindEvents = (
    resolve: (value?: unknown) => void,
    reject: (reason?: any) => void
  ) => {
    // 커넥션 연결 성공시 발생하는 이벤트 바인딩
    this._jitsiConnection.addEventListener(
      JitsiConnectionEvents.CONNECTION_ESTABLISHED,
      () => {
        resolve();
      }
    );

    // 연결 실패 이벤트 바인딩
    this._jitsiConnection.addEventListener(
      JitsiConnectionEvents.CONNECTION_FAILED,
      () => {
        reject('화상 연결에 실패하였습니다.');
      }
    );

    // CONNECTION_DISCONNECTED
    this._jitsiConnection.addEventListener(
      JitsiConnectionEvents.CONNECTION_DISCONNECTED,
      () => {
        reject('Connection  - 화상 연결에 실패하였습니다.');
      }
    );
  };
}

export default Connection;
