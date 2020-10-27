import React, { useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import LoginInputPresenter from './LoginInputPresenter';
import { WEHAGO_ENV } from '../../../../config';

import UserApi from '../../../services/api/LoginApi/UserApi';
import { actionCreators as UserActions } from '../../../redux/modules/user';
import ServiceCheckApi from '../../../services/api/ServiceCheckApi';

const iswehagov = WEHAGO_ENV === 'WEHAGOV';

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
  let _serviceCode;
  if (iswehagov) {
    _serviceCode = Platform.OS === 'ios' ? 'wehagovmeet' : 'meetv';
  } else {
    _serviceCode = Platform.OS === 'ios' ? 'wehagomeet' : 'meet';
  }

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

  _handleCheckServce = async (auth) => {

    const statusCheck = await ServiceCheckApi.companyStatusCheck(
      auth,
      auth.last_access_company_no
    );
    // 이상이 없는 회사일 경우 로그인 정상 진행
    if (statusCheck && statusCheck.code === 200) {
      // 서비스 구매여부 조회
      const isPurchase = await ServiceCheckApi.serviceCheck(
        auth,
        auth.last_access_company_no,
        'P' // 구매여부 확인
      );
      // 서비스 배포여부 조회
      const isDeploy = await ServiceCheckApi.serviceCheck(
        auth,
        auth.last_access_company_no,
        'D' // 배포여부 확인
      );
      UserActions.setPermission(isDeploy);

      props.onChangeRootState({
        destination: isPurchase ? 'list' : 'company'
      });
    } else if (statusCheck && statusCheck.code === 400) {
      // 회사에 이상이 있을 경우, 회사 선택 화면으로 이동
      Alert.alert('알림', statusCheck.message);
      props.onChangeRootState({
        destination: 'company'
      });
    } else {
      // 중간에 알 수 없는 오류 발생 시
      props.onChangeRootState({
        destination: 'company'
      });
    }
  };

  useEffect(() => {
    let auth = props.auth;
    if (Object.keys(auth).length !== 0) {
      _handleCheckServce(auth);
    }
  }, [props.auth]);

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
        // const resultAlert = await _handleSetAlert();
        const resultAlert = await new Promise(resolve => {
          Alert.alert('login', getAuth.resultMsg, [
            {
              text: '확인',
              onPress: () => {
                resolve(true);
              }
            },
            {
              text: '취소',
              onPress: () => {
                resolve(false);
              }
            }
          ]);
        });
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

      const auth = getAuth.resultData;
      const result = await props.loginCheckRequest(
        auth.AUTH_A_TOKEN,
        auth.AUTH_R_TOKEN,
        auth.last_access_company_no,
        auth.HASH_KEY,
        false
      );

      if (result.errors) {
        if (result.errors.code === 'E002') {
          this._handleOnAlert(2);
          Alert.alert(
            'Login',
            iswehagov
              ? '세션이 만료되었습니다. 다시 로그인 해주세요.'
              : '고객님의 다른 기기에서 WEHAGO 접속정보가 확인되어 로그아웃 됩니다.',
            [
              {
                text: '확인',
                onPress: () => {
                  UserActions.logout();
                }
              }
            ]
          );
        } else if (result.errors.status === '400') {
          Alert.alert('Login', '로그인 정보가 잘못되었습니다.');
        } else if (result.errors.status === '401') {
          Alert.alert('Login', '권한이 없습니다.');
        } else if (result.errors.message === 'timeout') {
          Alert.alert('Login', `요청 시간을 초과했습니다. 다시 시도해주세요.`);
        } else {
          Alert.alert(
            'Login',
            `사소한 문제가 발생했습니다. 다시 시도해주세요.`
          );
        }
        return;
      }
      // else if (
      //   result.resultData.user_name ||
      //   result.resultData.auth.user_name
      // ) {

      //   const statusCheck = await ServiceCheckApi.companyStatusCheck(
      //     auth,
      //     auth.last_access_company_no
      //   );
      //   // 이상이 없는 회사일 경우 로그인 정상 진행
      //   if (statusCheck && statusCheck.code === 200) {
      //     debugger
      //     // 서비스 구매여부 조회
      //     const isPurchase = await ServiceCheckApi.serviceCheck(
      //       auth,
      //       auth.last_access_company_no,
      //       'P' // 구매여부 확인
      //     );
      //     // 서비스 배포여부 조회
      //     const isDeploy = await ServiceCheckApi.serviceCheck(
      //       auth,
      //       auth.last_access_company_no,
      //       'D' // 배포여부 확인
      //     );
      //     UserActions.setPermission(isDeploy);
      //     props.onChangeRootState({
      //       destination: isPurchase ? 'list' : 'company'
      //     });
      //   } else if (statusCheck && statusCheck.code === 400) {
      //     // 회사에 이상이 있을 경우, 회사 선택 화면으로 이동
      //     Alert.alert('알림', statusCheck.message);
      //     props.onChangeRootState({
      //       destination: 'company'
      //     });
      //   } else {
      //     // 중간에 알 수 없는 오류 발생 시
      //     props.onChangeRootState({
      //       destination: 'company'
      //     });
      //   }
      // }

      // onLoginSuccess({
      //   type: 'ON_LOGIN_SUCCESS',
      //   auth: getAuth.resultData
      // });
    } else {
      // 로그인 실패
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
        iswehagov,
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
