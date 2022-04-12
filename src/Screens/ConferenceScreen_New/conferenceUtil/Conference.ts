import JitsiMeetJS, { JitsiConnectionEvents } from '@jitsi/base/lib-jitsi-meet';
import { ConferenceHandler } from './ConferenceHandler';
import config from './config';

class Conference {
  private _connection: any;
  constructor(conferenceParams: any, handler: ConferenceHandler) {
    this._connection = this._creaeteJitsiConnection(conferenceParams);
  }

  join = () =>
    new Promise((resolve, reject) => {
      this._bindEvents(resolve, reject);
      this._connection.connect();
    });

  _creaeteJitsiConnection = (conferenceParams: any) => {
    const options = { ...config };
    options.bosh = `https:${options.bosh}?room=${conferenceParams.roomName}`;
    const jitsiConnection = new JitsiMeetJS.JitsiConnection(
      null,
      conferenceParams.token ?? null,
      options
    );
    return jitsiConnection;
  };

  _bindEvents = (
    resolve: (value: unknown) => void,
    reject: (reason?: any) => void
  ) => {
    // 커넥션 연결 성공시 발생하는 이벤트 바인딩
    this._connection.addEventListener(
      JitsiConnectionEvents.CONNECTION_ESTABLISHED,
      resolve
    );

    // 연결 실패 이벤트 바인딩
    this._connection.addEventListener(
      JitsiConnectionEvents.CONNECTION_FAILED,
      reject
    );

    // CONNECTION_DISCONNECTED
    this._connection.addEventListener(
      JitsiConnectionEvents.CONNECTION_DISCONNECTED,
      reject
    );
  };
}

export default Conference;
