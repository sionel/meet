import React from 'react';
import { Platform } from 'react-native';
import SettingScreenPresenter from './SettingScreenPresenter';
import JitsiMeetJS from '../../../jitsi/features/base/lib-jitsi-meet';
import config from '../../utils/conference/config';
import Orientation from 'react-native-orientation-locker';
import { MeetApi } from '../../services';

const commonStyle = {
  height: 53,
  color: '#fff',
  backgroundColor: '#1C90FB'
};

class SettingScreenContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      tracks: [],
      orientation: undefined,
      nameField: false
    };
  }

  async componentDidMount() {
    this._init();
    let tracks = await this._getTrack();
    let accesstype = this.props.screenProps?.params?.accesstype;

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
      tracks,
      nameField: accesstype === 'email' || accesstype === 'joincode'
    });
  }

  componentWillUnmount() {
    Orientation.unlockAllOrientations();
    Orientation.removeOrientationListener(this._handleOrientation);
  }

  render() {
    const { tracks, name, orientation, nameField } = this.state;
    return (
      <SettingScreenPresenter
        tracks={tracks}
        name={name}
        nameField={nameField}
        orientation={orientation}
        onConferenceEnter={this._handleConferenceEnter}
        onToggleAudio={this._handleToggleAudio}
        onToggleVideo={this._handleToggleVideo}
        onSetName={this._handleSetName}
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

  _handleConferenceEnter = async () => {
    const { navigation, auth, webAuth } = this.props;
    const item = navigation.state.params.item;
    let { tracks, name } = this.state;
    const params = item.params;
    if (!name) {
      name = webAuth?.user_name ? webAuth?.user_name : auth.user_name;
    }
    let roomToken;
    debugger
    if (params?.accesstype === 'email') {
      roomToken = (
        await MeetApi.getMeetRoomTokenEmail(params.roomId, params.token, name)
      ).resultData;
    } else if (item?.params?.accesstype === 'joincode') {
      roomToken = (
        await MeetApi.getMeetRoomTokenJoincode(params.roomId, params.joincode, name)
      ).resultData;
    } else {
      // 토큰받고
      roomToken = (
        await MeetApi.getMeetRoomToken(
          auth.AUTH_A_TOKEN,
          auth.AUTH_R_TOKEN,
          auth.HASH_KEY,
          auth.last_access_company_no,
          item.videoRoomId
        )
      ).resultData;
    }
    
    // this.props.navigation.navigate('Home'); replace가 문제 없으면 삭제
    navigation.replace('Conference', {
      item: { tracks, roomToken, name, ...item }
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
