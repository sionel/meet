import React from 'react';
import { Platform } from 'react-native';
import SettingScreenPresenter from './SettingScreenPresenter';
import JitsiMeetJS from '../../../jitsi/features/base/lib-jitsi-meet';
import config from '../../utils/conference/config';
import Orientation from 'react-native-orientation-locker';

const commonStyle = {
  height: 53,
  color: '#fff',
  backgroundColor: '#1C90FB'
};

class SettingScreenContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      tracks: [],
      orientation: undefined
    };
  }

  async componentDidMount() {
    this._init();
    let tracks = await this._getTrack();

    if (Platform.OS !== 'ios') {
      Orientation.lockToPortrait();
    }
    Orientation.getOrientation(orientation => {
      const status =
        orientation === 'LANDSCAPE' ||
        orientation === 'LANDSCAPE-LEFT' ||
        orientation === 'LANDSCAPE-RIGHT';
      this.setState({ orientation: status ? 'horizontal' : 'vertical' });
    });

    Orientation.addOrientationListener(this._handleOrientation);

    this.setState({
      tracks
    });
  }

  componentWillUnmount() {
      Orientation.unlockAllOrientations();
      Orientation.removeOrientationListener(this._handleOrientation);
  }

  render() {
    const { tracks, name, orientation } = this.state;
    return (
      <SettingScreenPresenter
        tracks={tracks}
        name={name}
        orientation={orientation}
        onConferenceEnter={this._handleConferenceEnter}
        onToggleAudio={this._handleToggleAudio}
        onToggleVideo={this._handleToggleVideo}
        onSetName={this._handleSetName}
        onBack={this._handleRedirect}
      />
    );
  }

  _init = () => {
    // JitsiMeetJS 를 초기화 한다.
    JitsiMeetJS.init({
      ...config
    });

    // JitsiMeetJS Log Level을 설정한다.
    JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);
  };

  _getTrack = async () => {
    const devices = ['video', 'audio'];
    const tracks = await JitsiMeetJS.createLocalTracks({
      devices,
      resolution: 320
    });
    const videoTrack = tracks.find(track => track.getType() === 'video');
    const audioTrack = tracks.find(track => track.getType() === 'audio');
    return [videoTrack, audioTrack];
  };
  _handleRedirect = () => {
    this.props.navigation.navigate('Home');
  };
  _handleConferenceEnter = () => {
    const item = this.props.navigation.state.params.item;
    let { tracks, name } = this.state;
    if (!name) {
      name = this.props.auth.user_name;
    }
    // this.props.navigation.navigate('Home'); replace가 문제 없으면 삭제
    this.props.navigation.replace('Conference', {
      item: { tracks, name, ...item }
    });
  };
  _handleToggleVideo = async () => {
    const { tracks } = this.state;
    const video = tracks[0];
    if (video.isMuted()) {
      await video.unmute();
    } else {
      await video.mute();
    }

    this.setState({
      tracks: tracks
    });
  };
  _handleToggleAudio = async () => {
    const { tracks } = this.state;
    const audio = tracks[1];
    if (audio.isMuted()) {
      await audio.unmute();
    } else {
      await audio.mute();
    }

    this.setState({
      tracks: tracks
    });
  };
  _handleSetName = name => {
    this.setState({
      name
    });
  };
  _handleOrientation = orientation => {
    const status =
      orientation === 'LANDSCAPE' ||
      orientation === 'LANDSCAPE-LEFT' ||
      orientation === 'LANDSCAPE-RIGHT';
    this.setState({ orientation: status ? 'horizontal' : 'vertical' });
  };
}

export default SettingScreenContainer;
