import React from 'react';
import { ToastAndroid, BackHandler } from 'react-native';
import MainVideoPresenter from './MainVideoPresenter';

/**
 * MainVideoContainer : 화상대화 화면
 */
class MainVideoContainer extends React.Component {
  state = {
    time:
      Date.now() - this.props.createdTime > 0
        ? Math.floor((Date.now() - this.props.createdTime) / 1000)
        : 0
    // objectFit: 'contain'
  };

  componentDidMount() {
    this._timer = setInterval(() => {
      let time = Math.floor((Date.now() - this.props.createdTime) / 1000);
      time > 0 && this.setState({ time });
    }, 500);

    BackHandler.addEventListener('hardwareBackPress', this._handleBackButton);
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    if (nextProps !== this.props) return true;
    if (nextState !== this.state) return true;
    return false;
  };

  componentWillUnmount() {
    // 앱 종료를 막음
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
      if (this._timer) {
        clearInterval(this._timer);
      }

      this.props.onClose(); // 컴포넌트 종료
    }
    return true;
  };

  // _handleChangeObjectFit = () => {
  //   this.setState(({ objectFit }) => ({
  //     objectFit: objectFit === 'cover' ? 'contain' : 'cover'
  //   }));
  // };
}

export default MainVideoContainer;
