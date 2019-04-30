/**
 * MainContainer
 * 최상위화면 컨테이너
 */
import React, { Component } from 'react';
import { Platform } from 'react-native';
// import Orientation from 'react-native-orientation-locker';
// import DeviceInfo from 'react-native-device-info';
import SplashScreen from 'react-native-splash-screen';
import MainPresenter from './MainPresenter';
import LoginScreen from '../Screens/LoginScreen';
import AppIntroSlide from '../components/AppIntroSlide';

class MainContainer extends Component {
  state = { isLogin: false };

  componentDidMount() {
    // isTablet ? Orientation.unlockAllOrientations() : Orientation.lockToPortrait();
    // Orientation.unlockAllOrientations();
    setTimeout(() => {
      Platform.OS !== 'ios' && SplashScreen.hide();
    }, 1000);
  }

  shouldComponentUpdate(nextProps, nextStates) {
    // console.log(nextProps.url);
    if (nextStates.isLogin !== this.state.isLogin) {
      console.log('update');
      return true;
    }

    if (!nextProps.isLogin) {
      this.setState({ isLogin: false });
    }

    return false;
  }

  render() {
    return (
      <AppIntroSlide>
        {this.state.isLogin ? (
          <MainPresenter {...this.props} />
        ) : (
          <LoginScreen handleOnLogin={this._handleOnLogin} />
        )}
      </AppIntroSlide>
    );
  }

  /**
   * 로그인 권한은 LoginScreen 이 가지고 있음
   * LoginScreen 에서 _handleOnLogin을 통해서 로그인 상태를 관리함
   */
  _handleOnLogin = () => {
    this.setState({ isLogin: true });
  };
}
export default MainContainer;
