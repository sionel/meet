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
// import InCallManager from 'react-native-incall-manager';

const isIOS = Platform.OS === 'ios';
const InCallManager = isIOS
  ? null
  : require('react-native-incall-manager').default;

const { AudioMode } = NativeModules;
const hasNotch = DeviceInfo.hasNotch() && isIOS;
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
    objectFit: 'contain',
    height: Dimensions.get('window').height
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
    Orientation.addOrientationListener(this._setOrientation);
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if (prevProps.documentListMode !== this.props.documentListMode) {
  //     if (this.props.documentListMode) {
  //       this.RNBS.open();
  //     } else {
  //       this.RNBS.close();
  //     }
  //   }
  // }

  componentWillUnmount() {
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
        height={this.state.height}
        speaker={this.state.speaker}
        orientation={this.state.orientation}
        hasNotch={hasNotch}
        onChangeSpeaker={this._handleChangeSpeaker}
        // onChangeSharingMode={this.props.onChangeSharingMode}
        onSetRef={this._handleSetRef}
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
        onSetRef={this._handleSetRef}
      />
    );
  }

  _handleSetRef = ref => {
    if (ref && this.RNBS !== ref) this.RNBS = ref;
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
    const { width, height } = Dimensions.get('window');
    const currentOrientation = height > width ? 'vertical' : 'horizontal';
    if (orientation !== currentOrientation) {
      this.setState({
        orientation: currentOrientation,
        height: Math.max(width, height)
      });
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
        if (isIOS) {
          AudioMode.setMode(speaker);
        } else {
          InCallManager &&
            InCallManager.setSpeakerphoneOn &&
            InCallManager.setSpeakerphoneOn(speaker == 2);
        }
        // InCallManager.setForceSpeakerphoneOn(false);
        // InCallManager.setMicrophoneMute(false);
      }
    );
  };
}

export default ContentContainer;
