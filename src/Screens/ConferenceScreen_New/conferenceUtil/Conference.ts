import JitsiMeetJS, { JitsiConnectionEvents } from '@jitsi/base/lib-jitsi-meet';
import { bindEvent, disposeEvent } from './roomListener';
import { ConferenceHandler } from './ConferenceHandler';
import config from './config';
import Connection from './Connection';
import sendMessage from './sendMessage';

import { actionCreators as participantsAction } from '@redux/participants_copy';

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

  join = async ({ id, token }: Room, user: any, dispatch: any) => {
    this._init();
    this._connection = new Connection();
    this._handler = ConferenceHandler(dispatch);
    await this._connection.connect(id, token);
    await new Promise((resolve, reject) => {
      this._room = this._createRoom(id);
      this._sendMessage = new sendMessage(this._room);
      const attributes = this._sendMessage.sendWehagoId(user);
      this._handler.setUserInfo(attributes);
      bindEvent(this._handler, this._room, resolve, reject);
      this._room.join();
    });
    this._addTracks();
  };

  dispose = () => {
    this._room.dispose();
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

  _addTracks = async () => {
    const tracks = await this._createTracks();
    tracks.forEach(track => () => {
      this._room.addTrack(track);
      this._handler.setUserTrack(track);
    });
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
}

export default Conference;
