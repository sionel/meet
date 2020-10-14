import React, { Component } from 'react';
import { Platform, Alert, BackHandler } from 'react-native';
import SplashScreenPresenter from './SplashScreenPresenter';
import { WEHAGO_ENV } from '../../../config';
import ServerNotiveCheck from '../../components/ServerNotiveCheck';
import { MeetApi } from '../../services';

const JailMonkey =
  Platform.OS === 'android' && WEHAGO_ENV === 'WEHAGOV'
    ? require('jail-monkey').default
    : null;

class SplashScreenContainer extends Component {
  constructor() {
    super();
  }

  componentDidMount = async () => {
    // 루팅 확인 및 디버깅 모드 확인
    debugger
    let result = false
    result = this.handleCheckSecurity()
    if(!result) return
    
    // 노티 확인
    this.handleCheckNotice();
    return 
  };

  handleCheckSecurity = async () => {
    const isJailBroken = JailMonkey?.isJailBroken();
    const isDebuggedMode = await JailMonkey?.isDebuggedMode();
    if (
      Platform.OS === 'android' &&
      WEHAGO_ENV === 'WEHAGOV' &&
      (isJailBroken || isDebuggedMode)
    ) {
      Alert.alert(
        '알림',
        '루팅된 단말에서는 WEHAGO모바일 서비스 이용이 제한됩니다. 보안을 위해 앱을 종료합니다.',
        [{ text: '확인', onPress: () => BackHandler.exitApp() }],
        { cancelable: false }
      );
      return false;
    }
    return true;
  };

  handleCheckNotice = async () => {
    
      const result = await MeetApi.checkVersion1()
    debugger
  };

  handleCheckNotice1 = async () => {
    try {
      const url =
        'https://raw.githubusercontent.com/GiDuck/check-service/master/check.json';
      const response = await fetch(url);
      const message = await response.json();
      setTimeout(() => {
        this.setState({ loading: false, message });
      }, 2000);
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  render() {
    return <SplashScreenPresenter />;
  }
}

export default SplashScreenContainer;
