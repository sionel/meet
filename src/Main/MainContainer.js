/**
 * MainContainer
 * 최상위화면 컨테이너
 */
import React, { Component } from 'react';
import { Alert, Linking, Platform, ToastAndroid } from 'react-native';

import SplashScreen from 'react-native-splash-screen';

import MainPresenter from './MainPresenter';
import LoginNavigation from '../Navigations/LoginNavigation';
// import LoginRoute from '../Routes/LoginRoute';
import AppIntroSlide from '../components/AppIntroSlide';
import { CustomAlert } from '../components';

// service
import { querystringParser } from '../utils';

class MainContainer extends Component {
  state = {
    isLogin: false,
    url: null,
    alert: {
      visible: false,
      type: 0,
      description: '',
      actions: [],
      onClose: () => {}
    }
  };

  componentDidMount() {
    // setTimeout(() => {
    //   Platform.OS !== 'ios' && SplashScreen.hide();
    // }, 1000);

    this.props.setInitInfo();
    this.props.setSharingMode();

    if (this.props.url.url) {
      this._handleGetWehagoToken(this.props.url);
    }

    if (Platform.OS === 'ios') {
      Linking.addEventListener('url', this._handleGetWehagoToken);
    }
  }

  shouldComponentUpdate(nextProps, nextStates) {
    // deep link 에 의한 url 변동 사항 캐치
    if (nextProps.url !== this.props.url) {
      this._handleGetWehagoToken(nextProps.url);
      return false;
    }

    // 로그인 여부 변경 사항 캐치
    if (
      nextStates.isLogin !== this.state.isLogin ||
      nextStates.alert !== this.state.alert
    ) {
      return true;
    }

    if (nextProps.session !== this.props.session && !nextProps.session) {
      this._handleOnAlert(2);
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

  componentWillUnmount() {
    Linking.removeEventListener('url', this._handleGetWehagoToken);
  }

  render() {
    return (
      <AppIntroSlide>
        {this.state.isLogin ? (
          <MainPresenter
            url={this.props.url}
            alert={this.state.alert}
            onAlert={this._handleOnAlert}
          />
        ) : (
          <LoginNavigation
            screenProps={{
              handleOnLogin: this._handleOnLogin,
              handleSaveUserinfo: this._handleSaveUserinfo,
              url: this.props.url,
              rootTag: this.props.rootTag,
              alert: this.state.alert,
              onAlert: this._handleOnAlert
            }}
          />
        )}

        <CustomAlert
          visible={this.state.alert.visible}
          title={'알림'}
          width={320}
          description={this.state.alert.description}
          actions={this.state.alert.actions}
          onClose={this.state.alert.onClose}
        />
      </AppIntroSlide>
    );
  }

  _handleOnAlert = type => {
    return new Promise((resolve, reject) => {
      let description = '';
      let actions = [];
      let onClose = this._handleOnCloseAlert;

      switch (type) {
        case 1:
          description =
            '고객님의 다른 기기에서 WEHAGO Meet을 사용하고 있습니다. 기존 접속을 종료하시고 새로 접속하시겠습니까?';
          onClose = () => {
            console.warn('취소1');
            this._handleOnCloseAlert();
            resolve(false);
          };
          actions = [
            {
              name: '취소',
              action: () => {
                console.warn('취소');
                this._handleOnCloseAlert();
                resolve(false);
              }
            },
            {
              name: '확인',
              action: () => {
                console.warn('확인');
                this._handleOnCloseAlert();
                resolve(true);
              }
            }
          ];
          break;
        case 2:
          description =
            '고객님의 다른 기기에서 WEHAGO Meet 접속정보가 확인되어 로그아웃 됩니다.';
          onClose = () => {
            console.warn('취소2');
            this._handleOnCloseAlert();
            resolve(false);
          };
          actions = [
            {
              name: '확인',
              action: () => {
                console.warn('확인');
                this._handleOnCloseAlert();
                resolve(false);
              }
            }
          ];
          break;
        default:
          this.setState({
            alert: {
              visible: false,
              type,
              description,
              onClose
            }
          });
          resolve(false);
          return;
      }

      this.setState({
        alert: { visible: true, type, description, actions, onClose }
      });
    });
  };
  _handleOnCloseAlert = () => {
    this.setState({
      alert: { visible: false, type: 0, description: '' }
    });
  };

  /**
   * 로그인 권한은 LoginScreen 이 가지고 있음
   * LoginScreen 에서 _handleOnLogin을 통해서 로그인 상태를 관리함
   */
  _handleOnLogin = () => {
    this.setState({ isLogin: true });
  };

  /**
   * DeepLink 로 접근한 경우
   */
  _handleGetWehagoToken = event => {
    if (!event.url) return;
    const result = querystringParser(event.url);

    // 화상대화 요청인지 판별
    if (result.is_creater || result.type) return;

    if (!result.mAuth_a_token) {
      Platform.OS === 'ios'
        ? Alert.alert('Login', '현재 위하고에 로그인되어 있지 않습니다.')
        : ToastAndroid.show(
            '현재 위하고에 로그인되어 있지 않습니다.',
            ToastAndroid.SHORT
          );
    }

    // 로그인 진행
    this._handleSaveUserinfo(
      result.mAuth_a_token,
      result.mAuth_r_token,
      result.mHASH_KEY,
      result.cno,
      true // 위하고앱으로 로그인인지 구분
    );
  };

  /**
   *  _handleSaveUserinfo
   * 유저정보 저장
   */
  _handleSaveUserinfo = async (
    AUTH_A_TOKEN,
    AUTH_R_TOKEN,
    HASH_KEY,
    cno,
    isWehagoLogin
  ) => {
    if (!AUTH_A_TOKEN) return;

    const { loginCheckRequest } = this.props;
    const result = await loginCheckRequest(
      AUTH_A_TOKEN,
      AUTH_R_TOKEN,
      cno,
      HASH_KEY,
      isWehagoLogin
    );

    if (result.errors) {
      if (result.errors.code === 'E002') {
        if (isWehagoLogin) Alert.alert('Login', '토큰이 만료되었습니다.');
        else this._handleOnAlert(2);
      } else if (result.errors.code === '401') {
        Alert.alert('Login', '권한이 없습니다.');
      } else {
        Alert.alert('Login', '사소한 문제가 발생했습니다. 다시 시도해주세요.');
      }
      return;
    } else if (
      result.resultData.user_name ||
      result.resultData.auth.user_name
    ) {
      this._handleOnLogin();
    }
  };

  // /**
  //  * _handleCheckPermissions
  //  */
  // _handleCheckPermissions = async () => {
  //   // 권한 목록 설정
  //   const permissions =
  //     Platform.OS === 'ios'
  //       ? [{ key: 'microphone', name: '마이크' }, { key: 'camera', name: '카메라' }]
  //       : [{ key: 'microphone', name: '마이크' }, { key: 'camera', name: '카메라' }];
  //   // 현재 권한 체크
  //   const response = await Permissions.checkMultiple(permissions.map(p => p.key));
  //   // 권한 설정 요청
  //   this._handleSetPermissions(response, permissions);
  // };

  // /**
  //  * _handleSetPermissions
  //  */
  // _handleSetPermissions = async (response, permissions, length = 0) => {
  //   // 재귀
  //   let len = length;
  //   if (length >= permissions.length) return;

  //   if (response[permissions[len].key] === 'authorized') {
  //     // 권한 승인 상태이면 다음 권한 설정
  //     return this._handleSetPermissions(response, permissions, ++len);
  //   } else {
  //     // 권한이 없으므로 권한 요청
  //     const result = await Permissions.request(permissions[len].key, {
  //       type: 'whenInUse'
  //     });
  //     // 권한 미승인 시 앱 종료 또는 환경설정으로 이동
  //     if (result !== 'authorized') {
  //       Alert.alert(
  //         permissions[len].name + ' 권한 요청',
  //         '화상대화 기능을 사용하시려면 해당 권한을 부여하세요.',
  //         [
  //           {
  //             text: 'OK',
  //             // 권한 다시 알리지 않음 설정 시 환경설정으로 이동
  //             onPress: () => {
  //               Platform.OS === 'ios'
  //                 ? this._handleCheckPermissions()
  //                 : BackHandler.exitApp();
  //               Platform.OS === 'ios'
  //                 ? Permissions.openSettings()
  //                 : AndroidSettings.open();
  //             }
  //           }
  //         ]
  //       );

  //       return;
  //     }
  //     // 권한 승인 시 다음 권한 설정
  //     return this._handleSetPermissions(response, permissions, ++len);
  //   }
  // };
}
export default MainContainer;
