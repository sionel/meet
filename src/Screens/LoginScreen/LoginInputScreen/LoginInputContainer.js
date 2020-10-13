import * as React from 'react';
import { Alert } from 'react-native';
import { getLoginType } from '../ServiceCodeConverter';
import LoginInputPresenter from './LoginInputPresenter';

import UserApi from '../../../services/api/LoginApi/UserApi';

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

export default function LoginInputContainer(props) {
  const {
    wehagoType,
    serviceCode,
    onLoginSuccess,
    onLoginFailure
  } = props;

  const _serviceCode = getLoginType(serviceCode, wehagoType);

  const [userId, setUserId] = React.useState('');
  const [userPw, setUserPw] = React.useState('');
  const [captchaInput, setCaptchaInput] = React.useState('');
  const [logging, setLogging] = React.useState(false);
  const [loginFailed, setLoginFailed] = React.useState(false);
  const [captcha, setCaptcha] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState(null);
  const [alertVisible, setAlertVisible] = React.useState({
    visible: false,
    onConfirm: () => {},
    onClose: () => {}
  });

  const usernameRef = React.useRef(null);
  const passwordRef = React.useRef(null);
  const captchaRef = React.useRef(null);

  const _handleChangeCapcha = () => {
    setCaptcha(_getTransactionId());
    setCaptchaInput('');
  };

  const _handleSetAlert = () => {
    return new Promise((resolve, reject) => {
      const resetAlert = () =>
        setAlertVisible({
          visible: false,
          onConfirm: () => {},
          onClose: () => {}
        });

      const onConfirm = () => {
        resetAlert();
        resolve(true);
      };
      const onClose = () => {
        resetAlert();
        resolve(false);
      };

      setAlertVisible({
        visible: true,
        onConfirm,
        onClose
      });
    });
  };

  const _handleLogin = async (userId, userPw, captcha, access_pass = 'F') => {
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

    // ANCHOR Create Token
    const UserApiRequest = UserApi;
    const getAuth = await UserApiRequest.loginRequest(
      userId,
      userPw,
      _serviceCode,
      captcha,
      access_pass
    );
    const tempPw = userPw.slice();
    setLogging(false);
    setUserPw('');
    setCaptchaInput('');

    if (getAuth.resultCode === 200 || getAuth.resultCode === 207) {
      if (getAuth.resultCode === 207 && access_pass === 'F') {
        // 중복 로그인 시 알림창
        const resultAlert = await _handleSetAlert();
        if (!resultAlert) return setLogging(false);
        else {
          await _handleLogin(userId, userPw, captcha, 'T');
          return;
        }
      }

      // 로그인 성공 시
      if (
        getAuth.resultData.viewType &&
        getAuth.resultData.viewType === 'qrcode'
      ) {
        await setCaptcha(null);
        _handleLogin(userId, tempPw, null);
        return;
      }
      setCaptcha(null);
      onLoginSuccess({
        type: 'ON_LOGIN_SUCCESS',
        auth: getAuth.resultData
      });
    } else {
      // 로그인 실패
      onLoginFailure({
        type: 'account/ON_LOGIN_FAILURE',
        result: getAuth
      });
      captcha && setCaptcha(_getTransactionId());

      if (getAuth.resultCode === 401) {
        captcha && setErrorMsg(getAuth.resultMsg);
        Alert.alert('로그인 실패', '아이디 또는 비밀번호가 올바르지 않습니다.');
        setLoginFailed(true);
      } else if (getAuth.resultCode === 403) {
        setLoginFailed(true);
        setCaptcha(_getTransactionId());
        Alert.alert(
          '로그인 실패',
          '로그인에 5번 실패해 자동입력 방지 문자 입력으로 이동합니다.'
        );
      } else if (getAuth.resultCode === 406) {
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
        wehagoType,
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
        logging,
        alertVisible
      }}
    />
  );
}

LoginInputContainer.defaultProps = {
  wehagoType: 'WEHAGO',
  onLoginSuccess: arg => {},
  onLoginFailure: arg => {}
};
