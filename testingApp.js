/* 
    App.js 를 해당 파일로 이름 변경 한 뒤 실행하면 됨
    sendcommand 같은거 테스팅 할때 또는 서버 테스팅 할때 사용하기 편할 듯
*/

import React, { Component } from 'react';
import { AppRegistry } from 'react-native';

import JitsiMeetJS, {
  JitsiConnectionEvents
} from './jitsi/features/base/lib-jitsi-meet';

import { Text, View, Button, TextInput } from 'react-native';
import { RTCView } from 'react-native-webrtc';

const config2 = {
  hosts: {
    domain: 'video.bizcubex.co.kr',
    muc: 'conference.video.bizcubex.co.kr'
  },

  bosh: 'https://video.bizcubex.co.kr/http-bind',
  openBridgeChannel: 'datachannel',
  channelLastN: -1,
  resolution: 720,
  constraints: {
    video: {
      aspectRatio: 1.3,
      height: {
        ideal: 720,
        max: 720,
        min: 240
      },
      width: { min: 640, max: 1280 }
    }
  },
  disableSuspendVideo: true,
  disableSimulcast: false,
  minHDHeight: 240,
  p2p: {
    enabled: true
  },
  stereo: true,
  e2eping: { pingInterval: 10000, analyticsInterval: 60000 },
  devMode: true
};

const config1 = {
  hosts: {
    domain: 'meet.jit.si',
    muc: 'conference.meet.jit.si',
    focus: 'focus.meet.jit.si'
  },

  bosh: 'https://meet.jit.si/http-bind',
  openBridgeChannel: 'datachannel',
  channelLastN: -1,
  resolution: 720,
  constraints: {
    video: {
      aspectRatio: 1.3,
      height: {
        ideal: 320,
        max: 720,
        min: 240
      },
      width: { min: 640, max: 1280 }
    }
  },
  disableSuspendVideo: true,
  disableSimulcast: false,
  minHDHeight: 240,
  p2p: {
    enabled: false
  },
  stereo: true,
  e2eping: { pingInterval: 10000, analyticsInterval: 60000 }
};

const config = {
  hosts: {
    domain: 'video.wehago.com',

    muc: 'conference.video.wehago.com'
  },

  bosh: 'https://video.wehago.com/http-bind',
  openBridgeChannel: 'datachannel',
  channelLastN: -1,
  resolution: 720,
  constraints: {
    video: {
      aspectRatio: 1.3,
      height: {
        ideal: 720,
        max: 720,
        min: 240
      },
      width: { min: 640, max: 1280 }
    }
  },
  disableSuspendVideo: true,
  disableSimulcast: false,
  minHDHeight: 240,
  p2p: {
    enabled: true
  },
  stereo: true,
  e2eping: { pingInterval: 10000, analyticsInterval: 60000 },
  devMode: true
};

export class App extends Component {
  constructor(props) {
    super(props);
    this._jitsiConference;
    this._jitsiConnection;
    this.state = {
      tracks: [],
      roomName: 'c25f7d90-05eb-45af-9088-71f194cbd51a',
      num: 0
    };
  }

  componentWillUnmount() {
    this._jitsiConnection?.disconnect();
    this._jitsiConference?.leave();
  }

  _joinUser = () => {};
  _addRemoteTrack = track => {
    if (track.getType() === 'video') {
      this.setState({ ...this.state, tracks: [...this.state.tracks, track] });
    }
  };
  _changeRoomName = text => {
    this.setState({
      ...this.state,
      roomName: text
    });
  };
  _clickButton = async num => {
    await this._jitsiConference?.leave();
    this._jitsiConference = null;
    await this._jitsiConnection?.disconnect();
    this._jitsiConnection = null;
    this.setState({
      ...this.state,
      tracks: [],
      num
    });
  };
  _connMeet = async () => {
    const num = this.state.num;
    const options = num === 0 ? config : num === 1 ? config1 : config2;

    JitsiMeetJS.init({
      ...options
    });
    JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);
    const roomName = this.state.roomName ? this.state.roomName : 'guestroom';
    let tracks;
    options.bosh = `${options.bosh}?room=${roomName}`;
    this._jitsiConnection = new JitsiMeetJS.JitsiConnection(
      null,
      null,
      options
    );
    const conferenceEvents = JitsiMeetJS.events.conference;

    await new Promise((res, rej) => {
      this._jitsiConnection.addEventListener(
        JitsiConnectionEvents.CONNECTION_ESTABLISHED,
        a => {
          res(a);
        }
      );
      this._jitsiConnection.addEventListener(
        JitsiConnectionEvents.CONNECTION_FAILED,
        () => {}
      );
      this._jitsiConnection.addEventListener(
        JitsiConnectionEvents.CONNECTION_DISCONNECTED,
        () => {}
      );
      this._jitsiConnection.connect({});
    });
    this._jitsiConference = this._jitsiConnection.initJitsiConference(
      roomName,
      options
    );

    this._jitsiConference.on(conferenceEvents.CONFERENCE_JOINED, () => {});
    this._jitsiConference.on(conferenceEvents.CONFERENCE_FAILED, () => {});
    this._jitsiConference.on(conferenceEvents.USER_JOINED, (id, user) => {
      this._joinUser(user);
    });
    this._jitsiConference.on(conferenceEvents.TRACK_ADDED, track => {
      if (!track.isLocal()) {
        this._addRemoteTrack(track);
      }
    });

    tracks = await JitsiMeetJS.createLocalTracks({
      devices: ['video', 'audio'],
      resolution: 320
    });
    debugger;
    let video = null;
    tracks.forEach(track => {
      this._jitsiConference.addTrack(track);
      if (track.getType() === 'video') {
        video = track;
      }
    });
    this._jitsiConference.join();

    this.setState({
      ...this.state,
      tracks: [...this.state.tracks, video]
    });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Button
          title={'video.wehago.com'}
          onPress={() => {
            this._clickButton(0);
          }}
        />
        <Button
          title={'meet.jit.si'}
          onPress={() => {
            this._clickButton(1);
          }}
        />
        <Button
          title={'video.bizcubex.co.kr'}
          onPress={() => {
            this._clickButton(2);
          }}
        />
        <Button
          title={'conn'}
          onPress={() => {
            this._connMeet();
          }}
        />
        {this.state.tracks?.length ? (
          this.state.tracks.map(track => (
            <RTCView
              style={{
                zIndex: 99,
                flex: 1,
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
              }}
              objectFit={'contain'}
              streamURL={track.getOriginalStream().toURL()}
              zOrder={1}
            />
          ))
        ) : (
          <TextInput
            style={{ backgroundColor: '#fff' }}
            onChangeText={() => {
              this._changeRoomName();
            }}
          >
            {this.state.roomName}
          </TextInput>
        )}
      </View>
    );
  }
}

AppRegistry.registerComponent('App', () => App);
