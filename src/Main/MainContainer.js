/**
 * MainContainer
 * 최상위화면 컨테이너
 */
import React, { Component } from 'react';
import { Alert, BackHandler, NativeModules, Platform } from 'react-native';

import SplashScreen from 'react-native-splash-screen';
import Permissions from 'react-native-permissions';

import MainPresenter from './MainPresenter';
import LoginScreen from '../Screens/LoginScreen';
import AppIntroSlide from '../components/AppIntroSlide';

const { AndroidSettings } = NativeModules;

class MainContainer extends Component {
  state = { isLogin: false, url: null };

  componentDidMount() {
    setTimeout(() => {
      Platform.OS !== 'ios' && SplashScreen.hide();
    }, 1000);

    this._handleCheckPermissions();
    this.props.setInitInfo();
    this.props.setSharingMode();
  }

  shouldComponentUpdate(nextProps, nextStates) {
    // deep link 에 의한 url 변동 사항 캐치
    if (nextProps.url !== this.props.url) {
      return true;
    }

    // 로그인 여부 변경 사항 캐치
    if (nextStates.isLogin !== this.state.isLogin) {
      return true;
    }

    if (!nextProps.isLogin) {
      this.setState({ isLogin: false });
    }

    // 회사 변경시 재로그인
    if (
      nextProps.auth.last_access_company_no !==
      this.props.auth.last_access_company_no
    ) {
      this.setState({ isLogin: false });
    }

    return false;
  }

  render() {
    return (
      <AppIntroSlide>
        {this.state.isLogin ? (
          <MainPresenter url={this.props.url} />
        ) : (
          <LoginScreen
            handleOnLogin={this._handleOnLogin}
            url={this.props.url}
            rootTag={this.props.rootTag}
          />
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

  /**
   * _handleCheckPermissions
   */
  _handleCheckPermissions = async () => {
    // 권한 목록 설정
    const permissions =
      Platform.OS === 'ios'
        ? ['microphone', 'camera']
        : ['microphone', 'camera'];
    // 현재 권한 체크
    const response = await Permissions.checkMultiple(permissions);
    // 권한 설정 요청
    this._handleSetPermissions(response, permissions);
  };

  /**
   * _handleSetPermissions
   */
  _handleSetPermissions = async (response, permissions, length = 0) => {
    // 재귀
    let len = length;
    if (length >= permissions.length) return;

    if (response[permissions[len]] === 'authorized') {
      // 권한 승인 상태이면 다음 권한 설정
      return this._handleSetPermissions(response, permissions, ++len);
    } else {
      // 권한이 없으므로 권한 요청
      const result = await Permissions.request(permissions[len], {
        type: 'whenInUse'
      });
      // 권한 미승인 시 앱 종료 또는 환경설정으로 이동
      if (result !== 'authorized') {
        Alert.alert(
          '권한 요청',
          '화상대화 기능을 사용하시려면 해당 권한을 부여하세요.',
          [
            {
              text: 'OK',
              // 권한 다시 알리지 않음 설정 시 환경설정으로 이동
              onPress: () => {
                Platform.OS === 'ios'
                  ? this._handleCheckPermissions()
                  : BackHandler.exitApp();
                Platform.OS === 'ios'
                  ? Permissions.openSettings()
                  : AndroidSettings.open();
              }
            }
          ]
        );

        return;
      }
      // 권한 승인 시 다음 권한 설정
      return this._handleSetPermissions(response, permissions, ++len);
    }
  };
}
export default MainContainer;
