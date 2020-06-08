import React, { useState, useRef } from 'react';
import { Platform, Alert } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import UserApi from '../../../services/api/UserApi';
import LoginInputPresenter from './LoginInputPresenter';

const _getTransactionId = () => {
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
  let string_length = 6;
  let randomstring = '';
  for (let i = 0; i < string_length; i++) {
    let rnum = Math.floor(Math.random() * chars.length);
    randomstring += chars.substring(rnum, rnum + 1);
  }
  return String(randomstring).split('').join(' ');
};

export default function LoginScreen(props) {
  const { handleSaveUserinfo, onAlert } = props.navigation.state.params;

  const [userId, setUserId] = useState('');
  const [userPw, setUserPw] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  // const [scrollY] = useState(new Animated.Value(0));
  const [logging, setLogging] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const [captcha, setCaptcha] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const captchaRef = useRef(null);

  const _handleChangeCapcha = () => {
    setCaptcha(_getTransactionId());
    setCaptchaInput('');
  };

  _handleLogin = async (userId, userPw, captcha, access_pass = 'F') => {
    if (!userId) return usernameRef.current.focus();
    else if (!userPw) return passwordRef.current.focus();
    else if (captcha && !captchaInput) return captchaRef.current.focus();

    setLogging(true);

    if (captcha && captchaInput !== captcha.replace(/(\s*)/g, '')) {
      Alert.alert('로그인 실패', '자동입력 방지문자를 잘못 입력하셨습니다.');
      _handleChangeCapcha();
      setLogging(false);
      setUserPw('');
      setCaptchaInput('');
      return;
    }

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
      portal_password: userPw,
      login_browser: 'WEHAGO-APP',
      ...osData
    };

    // result data
    const loginResult = await UserApi.login(data, captcha, access_pass);
    const tempPw = userPw.slice();
    setLogging(false);
    setUserPw('');
    setCaptchaInput('');

    if (loginResult.resultCode === 200 || loginResult.resultCode === 207) {
      if (loginResult.resultCode === 207 && access_pass === 'F') {
        // 중복 로그인 시 알림창
        const resultAlert = await onAlert(1);
        if (!resultAlert) return setLogging(false);
        else return _handleLogin(userId, tempPw, captcha, 'T');
      }

      // 로그인 성공 시
      if (
        loginResult.resultData.viewType &&
        loginResult.resultData.viewType === 'qrcode'
      ) {
        // dispatch({ type: 'account/ON_LOGIN_FAILURE' });
        // setCaptcha(_getTransactionId());
        // Alert.alert(
        //   '로그인 실패',
        //   '비정상적인 로그인 시도가 지속되어 로그인을 제한합니다. 5분 후에 다시 시도해주세요.'
        // );
        await setCaptcha(null);
        _handleLogin(userId, tempPw, null);
        return;
      }
      setCaptcha(null);

      handleSaveUserinfo(
        loginResult.resultData.AUTH_A_TOKEN,
        loginResult.resultData.AUTH_R_TOKEN,
        loginResult.resultData.HASH_KEY,
        loginResult.resultData.last_access_company_no,
        false // 위하고앱으로 로그인인지 구분
      );
    } else {
      setLogging(false);
      captcha && setCaptcha(_getTransactionId());

      if (loginResult.resultCode === 401) {
        captcha && setErrorMsg(loginResult.resultMsg);
        Alert.alert('로그인 실패', '아이디 또는 비밀번호가 올바르지 않습니다.');
        setLoginFailed(true);
      } else if (loginResult.resultCode === 403) {
        setLoginFailed(true);
        setCaptcha(_getTransactionId());
        Alert.alert(
          '로그인 실패',
          '로그인에 5번 실패해 자동입력 방지 문자 입력으로 이동합니다.'
        );
      } else if (loginResult.resultCode === 406) {
        Alert.alert(
          '사용제한안내',
          '소속된 회사가 존재하지 않거나 가입단계가 완료되지 않아 로그인할 수 없습니다.'
        );
      } else Alert.alert('로그인 실패', '로그인에 실패했습니다.');
    }
  };

  return (
    <LoginInputPresenter
      {...{
        ...props.navigation.state.params,
        usernameRef,
        passwordRef,
        captchaRef,
        captcha,
        userId,
        setUserId,
        loginFailed,
        userPw,
        setUserPw,
        _handleLogin,
        _handleChangeCapcha,
        captchaInput,
        setCaptchaInput,
        errorMsg,
        logging
      }}
    />
  );
}
