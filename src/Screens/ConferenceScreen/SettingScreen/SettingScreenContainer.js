import React from 'react';
import SettingScreenPresenter from './SettingScreenPresenter';
import JitsiMeetJS from '../../../../jitsi/features/base/lib-jitsi-meet';
import config from '../../../utils/conference/config';
import Orientation from 'react-native-orientation-locker';
import { createStackNavigator } from 'react-navigation';

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
    
    // this.props.navigation.setOptions({ title: '1234ghj123bhj123bj12bhj' });

    this._init();
    
    let tracks = await this._getTrack();
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

  componentWillUnmount(){
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
        onBack={this.props.onBack}
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
    ;
    const videoTrack = tracks.find(track => track.getType() === 'video');
    const audioTrack = tracks.find(track => track.getType() === 'audio');
    ;
    return [videoTrack, audioTrack];
  };

  _handleConferenceEnter = () => {};
  _handleToggleAudio = () => {};
  _handleToggleVideo = () => {};
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

// SettingScreenContainer.navigationOptions = ({navigation}) => {
  
//   return {
//     headerTitle: <RouteTitle title={'xopxpxpxpxpdfabshjfghsdjk'} />,
//     headerLeft: <BackButton navigation={navigation} to={'Home'} />,
//     headerTintColor: '#fff',
//     headerStyle: commonStyle
//   }
// }


export default SettingScreenContainer