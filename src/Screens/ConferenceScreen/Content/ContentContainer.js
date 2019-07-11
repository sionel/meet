import React from 'react';
import {
  Dimensions,
  NativeModules,
  Platform,
  ToastAndroid,
  BackHandler
} from 'react-native';
import ContentPresenter from './ContentPresenter';
import FileSharing from './FileSharing';
import { ConferenceModes } from '../../../utils/Constants';
// import Orientation from 'react-native-orientation-locker';
import DeviceInfo from 'react-native-device-info';
import Orientation from 'react-native-orientation-locker';
import _ from 'underscore';

const { AudioMode } = NativeModules;
const hasNotch = DeviceInfo.hasNotch() && Platform.OS === 'ios';
/**
 * ContentContainer : 화상대화 화면
 */
class ContentContainer extends React.Component {
  /**
   * STATE
   */
  state = {
    orientation:
      Dimensions.get('window').height > Dimensions.get('window').width
        ? 'vertical'
        : 'horizontal',
    isVideoReverse: false,
    speaker: 2,
    objectFit: 'contain'
    // drawing: false
  };

  /**
   * componentDidMount
   */
  componentDidMount() {
    // Orientation.addOrientationListener(orientation => {
    //   orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT'
    //     ? this.setState({ orientation: 'horizontal' })
    //     : this.setState({ orientation: 'vertical' });
    // });
    // 스피커폰 설정
    this._handleChangeSpeaker(AudioMode.VIDEO_CALL);
    BackHandler.addEventListener('hardwareBackPress', this._handleBackButton);
    Orientation.addOrientationListener(this._setOrientation);
  }

  componentWillUnmount() {
    // 앱 종료를 막음
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this._handleBackButton
    );
    Orientation.removeOrientationListener(this._setOrientation);
  }

  /**
   * REDNER
   */
  render() {
    return this.props.attributes ? (
      <FileSharing
        // display={this.props.attributes}
        // sharing={this.props.attributes}
        // onClear={this.props.onClear}
        {...this.props}
        orientation={this.state.orientation}
        onChangeSharingMode={this.props.onChangeSharingMode}
        hasNotch={hasNotch}
      />
    ) : (
      <ContentPresenter
        {...this.state}
        {...this.props}
        hasNotch={hasNotch}
        toggleConferenceMode={this._toggleConferenceMode}
        onReverseVideo={this._handleReverseVideo}
        onLayout={this._setOrientation}
        onChangeSpeaker={this._handleChangeSpeaker}
        onChangeState={this._handleChangeState}
        onChangeObjectFit={this._handleChangeObjectFit}
      />
    );
  }

  /**
   * _handleBackButton
   */
  _handleBackButton = () => {
    // 1000(1초) 안에 back 버튼을 한번 더 클릭 할 경우 앱 종료
    if (this.exitContent == undefined || !this.exitContent) {
      ToastAndroid.show(
        '한번 더 누르면 화상대화가 종료됩니다.',
        ToastAndroid.SHORT
      );
      this.exitContent = true;

      this.timeout = setTimeout(() => {
        this.exitContent = false;
      }, 1000);
    } else {
      clearTimeout(this.timeout);

      this.props.onClose(); // 컴포넌트 종료
    }
    return true;
  };

  _handleChangeObjectFit = () => {
    this.setState(({ objectFit }) => ({
      objectFit: objectFit === 'cover' ? 'contain' : 'cover'
    }));
  };

  /**
   * _handleChangeState
   */
  _handleChangeState = (target, value) => {
    this.setState({ [target]: value });
  };

  /**
   * 대화 모드(참여자가 보일지 / 컨트롤 버튼이 보일지) 변경
   */
  _toggleConferenceMode = () => {
    const { setConferenceMode, conferenceMode } = this.props;
    if (conferenceMode === ConferenceModes.CONTROL) {
      setConferenceMode(ConferenceModes.NORMAL);
    } else {
      setConferenceMode(ConferenceModes.CONTROL);
    }
  };

  /**
   * 방향을 지정한다.
   */
  _setOrientation = () => {
    const { orientation } = this.state;
    const currentOrientation =
      Dimensions.get('window').height > Dimensions.get('window').width
        ? 'vertical'
        : 'horizontal';
    if (orientation !== currentOrientation) {
      this.setState({ orientation: currentOrientation });
    }
  };

  /**
   * 카메라 좌우반전
   */
  _handleReverseVideo = _.throttle(() => {
    this.setState(prev => ({ isVideoReverse: !prev.isVideoReverse }));
  }, 1000);

  /**
   * 스피커폰 활성화
   */
  _handleChangeSpeaker = () => {
    /*
		[ 1(수화기) | 2(스피커) ]
		*/
    const { speaker } = this.state;

    this.setState(
      prev => ({ speaker: prev.speaker == 2 ? 1 : 2 }),
      () => {
        AudioMode.setMode(speaker);
      }
    );
  };
}

export default ContentContainer;
