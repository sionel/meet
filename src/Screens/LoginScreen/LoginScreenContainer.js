/**
 * LoginScreenContainer
 *
 * 로그인페이지 컨테이너
 */

import React from 'react';
import { Linking, Platform, View, Alert, Dimensions } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Orientation from 'react-native-orientation-locker';

import LoginScreenPresenter from './LoginScreenPresenter';
import LoginFailAlert from './Content/LoginFailAlert';
import { CustomLottie } from '../../components';
// service
import { querystringParser } from '../../utils';

// const deviceHeight = Dimensions.get('window').height;
const isTablet = DeviceInfo.isTablet();
const { height, width } = Dimensions.get('window');

class LoginScreenContainer extends React.Component {
  /**
   * STATE
   */
  state = {
    userId: '',
    userPwd: '',
    nextInput: null,
    modal: false,
    modalText: '',
    waiting: true,
    autoLoginFlag: true,
    webView: false
    // height: deviceHeight
  };

  componentDidMount() {
    Linking.getInitialURL().then(url => {
      if (url) {
        this._handleGetWehagoToken({ url });
      }
    });
    Linking.addEventListener('url', this._handleGetWehagoToken);

    this._handleCheckUser();
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this._handleGetWehagoToken);
  }

  /**
   * Rendering
   */
  render() {
    const { permission } = this.props;
    const {
      list,
      userId,
      userPwd,
      modal,
      modalText,
      nextInput,
      waiting,
      autoLoginFlag,
      webView
    } = this.state;
    if (waiting) {
      Orientation.unlockAllOrientations();
      return (
        <View style={{ flex: 1 }}>
          <CustomLottie
            source={'waiting'}
            containerStyle={{ backgroundColor: 'transparent' }}
            width={225}
            height={225}
          >
            <LoginFailAlert
              modal={modal}
              modalText={modalText}
              onCancelTryLogin={this._handleCancelTryLogin}
            />
          </CustomLottie>
        </View>
      );
    }

    return (
      <LoginScreenPresenter
        onChangeValue={this._handleChangeValue}
        onLogin={this._handleLogin}
        onLoginForWehago={this._handleLoginForWehago}
        onActivateModal={this._handleActivateModal}
        onEnterKeyDown={this._handleEnterKeyDown}
        // onTokenLogin={this.props.onTokenLogin}
        onAgreement={this.props.onAgreement}
        autoLoginFlag={autoLoginFlag}
        userPwd={userPwd}
        userId={userId}
        list={list}
        modal={modal}
        modalText={modalText}
        webView={webView}
        permissionModal={permission}
        nextInput={nextInput}
        phrases="Loading"
        // height={deviceHeight}
        height={isTablet ? height : Math.max(width, height)}
        hasNotch={DeviceInfo.hasNotch()}
        // onSubmitNext={this._submitNext}
      />
    );
  } // render

  /**
   * 화면 회전 시
   */
  // _handleDeviceOrientation = () => {
  // 	console.log(DeviceInfo.Dimensions);
  // }

  // _focusNextField = key => {
  // 	this.inputs[key].focus();
  // }

  // _submitNext = () => {
  // 	this.focusNextField('next-field');
  // }

  /**
   * _handleChangeValue
   * 페이지 이동
   */
  _handleChangeValue = (target, value) => {
    this.setState({ [target]: value });
  };

  /**
   * 유저정보 체크 _handleCheckUser
   */
  _handleCheckUser = async (count = 1) => {
    const { auth, loginCheckRequest } = this.props;
    if (auth.AUTH_A_TOKEN) {
      const copyAuth = JSON.stringify(auth);
      const result = await loginCheckRequest(
        auth.AUTH_A_TOKEN,
        auth.AUTH_R_TOKEN,
        auth.last_access_company_no,
        auth.HASH_KEY
      );

      setTimeout(() => {
        if (result.errors) {
          switch (result.errors.code) {
            case 'E002':
              this.setState({ waiting: false });
              return this._handleActivateModal(
                '토큰이 만료되었습니다. 다시 로그인 해주세요.'
              );
            default:
              if (count < 6 && this.state.waiting) {
                this._handleActivateModal(
                  '로그인 실패\n재시도중 (' + count + '/5)'
                );
                return setTimeout(() => {
                  this._handleCheckUser(++count);
                }, 1000);
              } else {
                return this.setState({ waiting: false });
              }
          }
        } else {
          return this.props.handleOnLogin();
        }
      }, 1000);
    } else {
      setTimeout(() => {
        return this.setState({ waiting: false });
      }, 1000);
    }
  };

  /**
   * _handleLogin
   * 로그인함수
   */
  _handleLogin = async (wehagoLogin = false) => {
    // const { navigation } = this.props;
    const { userId, userPwd } = this.state;
    const { loginRequest } = this.props;
    const deviceIP = await DeviceInfo.getIPAddress();
    const osData =
      Platform.OS === 'ios'
        ? {
            login_ip: deviceIP,
            login_device: DeviceInfo.getModel(),
            login_os:
              DeviceInfo.getSystemName() + ' ' + DeviceInfo.getSystemVersion()
          }
        : {
            login_ip: deviceIP,
            login_device: DeviceInfo.getModel(),
            login_os:
              DeviceInfo.getSystemName() + ' ' + DeviceInfo.getSystemVersion()
          };
    const data = {
      portal_id: userId,
      portal_password: userPwd,
      login_browser: 'WEHAGO-APP',
      ...osData
    };

    // result data
    const { resultCode, resultData } = await loginRequest(data);

    if (resultCode === 200) {
      this._handleSaveUserinfo(
        resultData.AUTH_A_TOKEN,
        resultData.AUTH_R_TOKEN,
        resultData.HASH_KEY,
        resultData.last_access_company_no
      );
    } else {
      this._handleActivateModal('아이디와 패스워드를 확인해 주세요');
    }
  };

  _handleCancelTryLogin = () => {
    this.setState({ waiting: false, modal: false });
  };

  /**
   * _handleSaveUserinfo
   */
  _handleSaveUserinfo = async (AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY, cno) => {
    /**
     * cno
     * AUTH_A_TOKEN
     * AUTH_R_TOKEN
     * HASH_KEY
     */

    const { navigation, loginCheckRequest } = this.props;
    const result = await loginCheckRequest(
      AUTH_A_TOKEN,
      AUTH_R_TOKEN,
      cno,
      HASH_KEY
    );
    if (result.errors) {
      if (result.errors.code === 'E002') {
        // alert('result11 : ' + JSON.stringify(result));
        // await this.props.onLogout();
        // this.forceUpdate();
      } else {
        alert('사소한 문제가 발생했습니다. 다시 시도해주세요.');
      }
    } else if (result.user_name || result.auth.user_name) {
      // navigation.navigate('Home');
      this.props.handleOnLogin();
    }
  };

  /**
   * _handleLoginForWehago
   */
  _handleLoginForWehago = () => {
    const iosUrl = 'wehago://?wehagomeet=login';
    const androidUrl = 'wehago://app?name=meet';
    const iosMarketURL =
      'http://itunes.apple.com/kr/app/wehago/id1363039300?mt=8';
    const androidMarketURL =
      'https://play.google.com/store/apps/details?id=com.duzon.android.lulubizpotal';

    Linking.openURL(Platform.OS === 'ios' ? iosUrl : androidUrl).catch(err => {
      Linking.openURL(
        Platform.OS === 'ios' ? iosMarketURL : androidMarketURL
      ).catch(err => {
        Alert.alert('스토어 정보가 없습니다.', '', [{ text: 'OK' }], {
          cancelable: true
        });
      });

      // if (Platform.OS === 'ios') {
      //   Linking.openURL(iosMarketURL).catch(err => {
      //     Alert.alert('스토어 정보가 없습니다.', '', [{ text: 'OK' }], {
      //       cancelable: true
      //     });
      //   });
      // } else if (Platform.OS === 'android') {
      //   Linking.openURL(androidMarketURL).catch(err => {
      //     Alert.alert('스토어 정보가 없습니다.', '', [{ text: 'OK' }], {
      //       cancelable: true
      //     });
      //   });
      // }
    });
  };

  /**
   *
   */
  _handleGetWehagoToken = event => {
    // alert(event.url);
    const result = querystringParser(event.url);
    // Linking.removeEventListener('url', this._handleGetWehagoToken);
    this._handleSaveUserinfo(
      result.mAuth_a_token,
      result.mAuth_r_token,
      result.mHASH_KEY,
      result.cno
    );
  };

  /**
   * _handleActivateModal
   * 로그인 실패 시 경고 모달 ON
   */
  _handleActivateModal = (text = '', val = true) => {
    this.setState(prev => ({ modal: val, modalText: text }));
    // 자동 close
    clearTimeout(this._toggleModalVisible);
    this._toggleModalVisible = setTimeout(() => {
      this.setState(prev => ({ modal: false }));
    }, 2100);
    // this._toggleModalVisible();
    // if (val) {
    // 	setTimeout(() => {
    // 		this.setState(prev => ({ modal: false }));
    // 	}, 2100);
    // }
  };

  /**
   * _handleEnterKeyDown
   * 엔터키 입력 시
   */
  _handleEnterKeyDown = e => {
    this._handleLogin();
  };
}

export default LoginScreenContainer;
