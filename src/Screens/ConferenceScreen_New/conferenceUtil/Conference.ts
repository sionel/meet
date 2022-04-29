import JitsiMeetJS, { JitsiConnectionEvents } from '@jitsi/base/lib-jitsi-meet';
import { bindEvent, disposeEvent } from './roomListener';
import { ConferenceHandler } from './ConferenceHandler';
import config from './config';
import Connection from './Connection';
import sendMessage from './sendMessage';

import { actionCreators as participantsAction } from '@redux/participants_copy';
import { actionCreators as conferenceActions } from '@redux/conference';
import DrawingManager from './DrawingManager';

interface Room {
  token: string;
  id: string;
}
class Conference {
  // private _conferenceParams: { roomToken: string; roomId: string };
  private _connection: any;
  private _room: any;
  private _sendMessage: any;
  private _dispatch: any;
  private _handler: any;

  constructor() {
    // this._conferenceParams = conferenceParams;
    // this._handler = ConferenceHandler(dispatch);
  }

  public get sendMessage() {
    return this._sendMessage;
  }

  join = async ({ id, token }: Room, user: any, dispatch: any, tracks: any) => {
    this._init();
    this._connection = new Connection();
    this._handler = ConferenceHandler(dispatch);
    await this._connection.connect(id, token);
    await new Promise((resolve, reject) => {
      this._room = this._createRoom(id);
      this._sendMessage = new sendMessage(this._room);
      const attributes = this._sendMessage.sendWehagoId(user);
      this._handler.setUserInfo({ value: this._room.myUserId(), attributes });
      this._handler.setMainUser(this._room.myUserId());
      bindEvent(this._handler, this._room, resolve, reject);
      this._room.join();
    });
    this._addTracks(tracks);
  };

  dispose = async () => {
    // this._room.dispose();
    await this._room.leave();
    this._connection.dispose();
    this._connection = null;
    this._sendMessage = null;
  };

  _init = () => {
    JitsiMeetJS.init({
      ...config
    });
    JitsiMeetJS.isDesktopSharingEnabled();
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

  _addTracks = async (tracks: any) => {
    // const tracks = await this._createTracks();

    tracks.forEach((track: any) => {
      this._room.addTrack(track);
      this._handler.setUserTrack(track);
    });
  };

  sendTextMessage = (text: string) => {
    if (text && text === '') return;
    this._room.sendTextMessage(text);
  };

  changeTrack = async (type: 'video' | 'desktop', oldTrack: any) => {
    const newTrack = (
      await JitsiMeetJS.createLocalTracks({
        devices: [type],
        resolution: 320
      })
    )[0];
    await this._room.replaceTrack(oldTrack, newTrack);
    this._dispatch(conferenceActions.setVideoState(newTrack));
    // this._dispatch(participantsAction.setUserTrack(newTrack));
  };

  getMyId = () => this._room.myUserId();

  //TODO: 셋팅에서 다 준비 된 상태에서 컨퍼런스로 넘어올건지 ? => 셋팅페이지에서 해당 함수를 통해서 트랙 미리 생성
  //      컨퍼런스 넘어와서 트랙 설정등을 할것인지 ? => 그렇다면 createLocalTracks를 통해서 트랙 생성이 필요
  // _createTracks = async (): Promise<any[]> => {
  //   const videoTrack = await JitsiMeetJS.createLocalTracks({
  //     devices: ['video'],
  //     resolution: 320
  //   });
  //   const audioTrack = await JitsiMeetJS.createLocalTracks({
  //     devices: ['audio'],
  //     resolution: 320
  //   });
  //   return [videoTrack[0], audioTrack[0]];
  // };
}

export default Conference;
