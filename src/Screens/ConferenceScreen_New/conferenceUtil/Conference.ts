import JitsiMeetJS, { JitsiConnectionEvents } from '@jitsi/base/lib-jitsi-meet';
import { bindEvent, disposeEvent } from './roomListener';
import { ConferenceHandler } from './ConferenceHandler';
import config from './config';
import Connection from './Connection';
import sendMessage from './sendMessage';

interface Room {
  token: string;
  id: string;
}
class Conference {
  // private _conferenceParams: { roomToken: string; roomId: string };
  private _connection: any;
  private _room: any;
  private _sendMessage: any;
  constructor() {
    // this._conferenceParams = conferenceParams;
    // this._handler = ConferenceHandler(dispatch);
  }

  public get sendMessage() {
    return this._sendMessage;
  }

  join = async ({ id, token }: Room, user: any, dispatch: any) => {
    this._init();
    const connection = new Connection();
    await connection.connect(id, token);
    this._connection = connection.jitsiConnection;
    await new Promise((resolve, reject) => {
      this._room = this._createRoom(id);
      this._sendMessage = new sendMessage(this._room);
      this._sendMessage.sendWehagoId(user);
      bindEvent(dispatch, this._room, resolve, reject);
      this._room.join();
    });
    this._addTracks();
    // // this._conference = new Conference(this._conferenceParams, this._handler);
    // await this._conference.connect();
    // await this._conference.join();

    // this._roomToken = token;
    // this._roomName = roomName.toLowerCase();
    // // 초기화
    // // 대화방 연결을 위한 Connection
    // this._connection = new Connection();
    // // 대화방 연결을 위한 ConferenceConnector
    // this._conferenceConnector = new ConferenceConnector(this.handler);
    // // connection 연결
    // await this._connection.connect(roomName.toLowerCase(), token);
    // // 대화방 참가
    // this._room = await this._conferenceConnector.connect(
    //   this._connection,
    //   roomName.toLowerCase(),
    //   tracks,
    //   attributes
    // );
    // this.tracks = tracks;
    // this._dispatch(masterAcionCreators.checkMasterList(this._roomToken));
    // if (this._room) return true;
    // else return false;
  };

  _init = () => {
    // JitsiMeetJS 를 초기화 한다.
    JitsiMeetJS.init({
      ...config
    });
    JitsiMeetJS.isDesktopSharingEnabled();

    // JitsiMeetJS Log Level을 설정한다.
    JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);
  };
  _createRoom = (roomId: string) => {
    const options = { ...config };
    const room = this._connection.jitsiConnection.initJitsiConference(
      roomId,
      options
    );
    return room;
  };

  _addTracks = async () => {
    const tracks = await this._createTracks();
    tracks.forEach(track => this._room.addTrack(track));
  };

  _createTracks = async (): Promise<any[]> => {
    const videoTrack = await JitsiMeetJS.createLocalTracks({
      devices: ['video'],
      resolution: 320
    });
    const audioTrack = await JitsiMeetJS.createLocalTracks({
      devices: ['audio'],
      resolution: 320
    });

    return [videoTrack[0], audioTrack[0]];
  };

  // connect = (connection, roomName, tracks, attributes) => {
  //   return new Promise(async (resolve, reject) => {
  //     // 참여할 room object 생성
  //     this._room = this._createRoom(connection, roomName);
  //     // 이벤트 연결
  //     await this._bindEvents(resolve, reject);
  //     // 트랙 생성
  //     // if (!tracks) tracks = await this._createTracks();
  //     // 트랙 추가
  //     this._addTracks(tracks);
  //     this.tracks = tracks;
  //     // wehago id를 커맨드로 전송한다.
  //     this._room.sendCommand(WEHAGO_ID, {
  //       value: this._room.myUserId(),
  //       attributes
  //     });

  //     // 대화방 참가
  //     await this._room.join();
  //   });
  // };
}

export default Conference;
