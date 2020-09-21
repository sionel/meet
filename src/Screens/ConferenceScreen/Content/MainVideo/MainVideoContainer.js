import React from 'react';
import {
  BackHandler,
  NativeModules,
  DeviceEventEmitter,
  Dimensions,
  Platform,
  ToastAndroid
} from 'react-native';
import MainVideoPresenter from './MainVideoPresenter';
const { PictureInPicture } = NativeModules;
const { width, height } = Dimensions.get('window');

/**
 * MainVideoContainer : 화상회의 화면
 */
class MainVideoContainer extends React.Component {
  state = {
    time:
      Date.now() - this.props.createdTime > 0
        ? Math.floor((Date.now() - this.props.createdTime) / 1000)
        : 0,
    pipMode: false
    // objectFit: 'contain'
  };

  componentDidMount() {
    this._timer = setInterval(() => {
      let time = Math.floor((Date.now() - this.props.createdTime) / 1000);
      time > 0 && this.setState({ time });
      // Platform.OS === 'android' && this._handleAppStateChange();
    }, 500);

    // DeviceEventEmitter.addListener(
    //   'ON_HOME_BUTTON_PRESSED',
    //   this._handleEnterPIPMode
    // );
    BackHandler.addEventListener('hardwareBackPress', this._handleBackButton);
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    if (nextProps !== this.props) return true;
    if (nextState !== this.state) return true;
    return false;
  };

  componentWillUnmount() {
    // DeviceEventEmitter.removeListener(
    //   'ON_HOME_BUTTON_PRESSED',
    //   this._handleEnterPIPMode
    // );
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this._handleBackButton
    );

    if (this._timer) {
      clearInterval(this._timer);
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (
  //     nextProps.isMuteVideo !== this.props.isMuteVideo ||
  //     nextProps.stream !== this.props.stream ||
  //     nextProps.videoType !== this.props.videoType ||
  //     nextProps.mainUser !== this.props.mainUser ||
  //     nextProps.callType !== this.props.callType ||
  //     nextState.time !== this.state.time ||
  //     nextState.isVideoReverse !== this.state.isVideoReverse
  //   ) {
  //     // console.log('render');
  //     return true;
  //   } else {
  //     // console.log('something is changed');
  //     return false;
  //   }
  // }

  render() {
    // console.log('RENDERING');
    return (
      <MainVideoPresenter
        {...this.props}
        {...this.state}
        // onChangeObjectFit={this._handleChangeObjectFit}
      />
    );
    // return <MainVideoPresenter {...this.props} isMuteVideo={false} />;
  }

  /**
   * _handleBackButton
   */
  _handleBackButton = () => {
    this._handleEnterPIPMode('BACK');

    // 앱 종료를 막는다.
    // true: 대기 / false: 뒤로가기
    return true;
  };

  /**
   * _handleEnterPIPMode
   */
  _handleEnterPIPMode = type => {
    PictureInPicture.enterPictureInPicture()
      // .then(() => this.setState({ pipMode: true }))
      .catch(() => {
        // Picture-in-Picture not supported
        // 1000(1초) 안에 back 버튼을 한번 더 클릭 할 경우 앱 종료
        if (type === 'BACK') {
          if (this.exitContent == undefined || !this.exitContent) {
            ToastAndroid.show(
              '한번 더 누르면 화상회의가 종료됩니다.',
              ToastAndroid.SHORT
            );
            this.exitContent = true;

            this.timeout = setTimeout(() => {
              this.exitContent = false;
            }, 1000);
          } else {
            clearTimeout(this.timeout);
            if (this._timer) {
              clearInterval(this._timer);
            }

            this.props.onClose(); // 컴포넌트 종료
          }
        }
      });
  };

  /**
   * _handleAppStateChange
   */
  // _handleAppStateChange = () => {
  //   // 기존의 기기 가로,세로와 현재의 가로,세로를 비교하여 PIP MODE 구분
  //   const { width: pWidth, height: pHeight } = Dimensions.get('window');
  //   const pipMode = Math.min(width, height) > Math.min(pWidth, pHeight);
  //   this.setState({ pipMode });
  // };

  // _handleChangeObjectFit = () => {
  //   this.setState(({ objectFit }) => ({
  //     objectFit: objectFit === 'cover' ? 'contain' : 'cover'
  //   }));
  // };
}

export default MainVideoContainer;
