import React from 'react';
import { Platform } from 'react-native';
import SettingScreenPresenter from './SettingScreenPresenter';
import JitsiMeetJS from '../../../jitsi/features/base/lib-jitsi-meet';
import config from '../../utils/conference/config';
import Orientation from 'react-native-orientation-locker';
import { MeetApi } from '../../services';
import { v4 as uuidv4 } from 'uuid';
import { getT } from '../../utils/translateManager';

class SettingScreenContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      tracks: [],
      orientation: undefined,
      nameField: false,
      buttonActive: false
    };
    this.t = getT();
  }

  async componentDidMount() {
    const {params,isLogin} = this.props;
    this._init();
    let tracks = await this._getTrack();
    let accesstype = params?.accesstype;
    // if (Platform.OS !== 'ios') {
    //   Orientation.lockToPortrait();
    // }
    Orientation.getOrientation(orientation => {
      const status =
        orientation === 'LANDSCAPE' ||
        orientation === 'LANDSCAPE-LEFT' ||
        orientation === 'LANDSCAPE-RIGHT';
      this.setState({ orientation: status ? 'horizontal' : 'vertical' });
    });

    Orientation.addOrientationListener(this._handleOrientation);
    this.setState({
      tracks: tracks ? tracks : null,
      nameField: !isLogin,
      buttonActive: tracks ? true : false
    });
  }

  componentWillUnmount() {
    Orientation.unlockAllOrientations();
    Orientation.removeOrientationListener(this._handleOrientation);
  }

  render() {
    const { tracks, name, orientation, nameField, buttonActive } = this.state;
    return (
      <SettingScreenPresenter
        tracks={tracks}
        name={name}
        nameField={nameField}
        orientation={orientation}
        buttonActive={buttonActive}
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
    // const devices = ['video', 'audio'];
    try {
      const videoTrack = await JitsiMeetJS.createLocalTracks({
        devices: ['video'],
        resolution: 320
      });
      const audioTrack = await JitsiMeetJS.createLocalTracks({
        devices: ['audio'],
        resolution: 320
      });
      return [videoTrack[0], audioTrack[0]];
    } catch (error) {
      this.props.setAlert({
        type: 1,
        title: this.t('alert_title_right'),
        message: this.t('alert_text_permission')
      });
      return null;
    }
  };

  _handleConferenceEnter = async () => {
    const { navigation, auth, webAuth } = this.props;
    const item = navigation.state.params.item;
    let { tracks, nameField } = this.state;
    let name;
    const params = item.params;

    if (nameField) {
      name = this.state.name;
      if (!name) {
        name = (await MeetApi.getExternalUserId(params.roomId)).resultData;
      }
    } else {
      name = webAuth?.user_name ? webAuth?.user_name : auth.user_name;
    }

    let roomToken;

    // const wedive = await MeetApi.checkWedrive(auth);
    
    const randomstring = uuidv4();
    const user = randomstring.substr(0, 8);

    if (params?.accesstype === 'email') {
      roomToken = (
        await MeetApi.getMeetRoomTokenEmail(params.roomId, params.token, name)
      ).resultData;
    } else if (item?.params?.accesstype === 'joincode') {
      roomToken = (
        await MeetApi.getMeetRoomTokenJoincode(
          params.roomId,
          params.joincode,
          name,
          user
        )
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
    if (roomToken === '접근금지') {
      // wehago V 때문에 절차가 하나 늘어남
      this.props.setAlert({
        type: 1,
        title: this.t('alert_title_error'),
        message: this.t('alert_text_waiting')
      });
    } else {
      navigation.replace('Conference', {
        item: {
          tracks,
          roomToken,
          name,
          ...item,
          accesstype: params?.accesstype,
          externalUser: user,
        }
      });
    }
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
