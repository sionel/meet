import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import LoginInputPresenter from './LoginInputPresenter';
import { WEHAGO_ENV } from '../../../../config';

import UserApi from '../../../services/api/LoginApi/UserApi';
import { actionCreators as UserActions } from '../../../redux/modules/user';
import ServiceCheckApi from '../../../services/api/ServiceCheckApi';

import { getT } from '../../../utils/translateManager';

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
    description: '',
    onClose: () => {},
    actions: []
  });

  const usernameRef = React.useRef(null);
  const passwordRef = React.useRef(null);
  const captchaRef = React.useRef(null);

  const t = getT();

  const _handleChangeCapcha = () => {
    setCaptcha(_getTransactionId());
    setCaptchaInput('');
  };

  const _resetAlert = () =>
    setAlertVisible({
      visible: false,
      description: '',
      onClose: () => {},
      actions: [],
      title: ''
    });

  _handleCheckServce = async auth => {
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
      props.setPermission(isDeploy);
      props.onChangeRootState({
        destination: isPurchase ? 'List' : 'SelectCompany'
      });
    } else if (statusCheck && statusCheck.code === 400) {
      const onClose = () => {
        _resetAlert();
        props.onChangeRootState({
          destination: 'SelectCompany'
        });
      };
      setAlertVisible({
        visible: true,
        title: t('alert.title.notion'),
        description: statusCheck.message,
        onClose,
        actions: [
          {
            name: t('alert.button.confirm'),
            action: onClose
          }
        ]
      });
    } else {
      props.onChangeRootState({
        destination: 'SelectCompany'
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
      const onClose = () => {
        _resetAlert();
      };
      _resetAlert();
      setAlertVisible({
        visible: true,
        title: t('alert.title.fail'),
        description: t('alert.text.방지문자틀림'),
        onClose,
        actions: [
          {
            name: t('alert.button.confirm'),
            action: onClose
          }
        ]
      });

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
          _resetAlert();
          setAlertVisible({
            visible: true,
            title: t('alert.title.notion'),
            description: getAuth.resultMsg,
            onClose: () => {
              _resetAlert();
              resolve(false);
            },
            actions: [
              {
                name: t('alert.button.confirm'),
                action: () => {
                  _resetAlert();
                  resolve(true);
                }
              },
              {
                name: t('alert.button.cancel'),
                action: () => {
                  _resetAlert();
                  resolve(false);
                }
              }
            ]
          });
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
        'this'
      );

      if (result.errors) {
        if (result.errors.code === 'E002') {
          const onClose = () => {
            _resetAlert();
            UserActions.logout();
          };

          _resetAlert();
          setAlertVisible({
            visible: true,
            title: t('alert.title.notion'),
            description: iswehagov
              ? t('alert.text.세션만료')
              : t('alert.text.duplicate_login'),
            onClose,
            actions: [
              {
                name: t('alert.button.confirm'),
                action: onClose
              }
            ]
          });
        } else if (result.errors.status === '400') {
          const onClose = () => {
            _resetAlert();
          };
          _resetAlert();
          setAlertVisible({
            visible: true,
            title: t('alert.title.notion'),
            description: t('alert.text.login_info_error'),
            onClose,
            actions: [
              {
                name: t('alert.button.confirm'),
                action: onClose
              }
            ]
          });
        } else if (result.errors.status === '401') {
          const onClose = () => {
            _resetAlert();
          };
          _resetAlert();
          setAlertVisible({
            visible: true,
            title: t('alert.title.notion'),
            description: t('alert.text.no_right'),
            onClose,
            actions: [
              {
                name: t('alert.button.confirm'),
                action: onClose
              }
            ]
          });
        } else if (result.errors.message === 'timeout') {
          const onClose = () => {
            _resetAlert();
          };
          _resetAlert();
          setAlertVisible({
            visible: true,
            title: t('alert.title.notion'),
            description: t('alert.text.timeover'),
            onClose,
            actions: [
              {
                name: t('alert.button.confirm'),
                action: onClose
              }
            ]
          });
        } else {
          const onClose = () => {
            _resetAlert();
          };
          _resetAlert();
          setAlertVisible({
            visible: true,
            title: t('alert.title.notion'),
            description: t('alert.text.problem_ocurred'),
            onClose,
            actions: [
              {
                name: t('alert.button.confirm'),
                action: onClose
              }
            ]
          });
        }
        return;
      }
    } else {
      // 로그인 실패
      captcha && setCaptcha(_getTransactionId());

      if (getAuth.resultCode === 401) {
        captcha && setErrorMsg(getAuth.resultMsg);
        const onClose = () => {
          _resetAlert();
        };
        _resetAlert();
        setAlertVisible({
          visible: true,
          title: t('alert.title.fail'),
          description: t('alert.text.아디비번틀림'),
          onClose,
          actions: [
            {
              name: t('alert.button.confirm'),
              action: onClose
            }
          ]
        });

        setLoginFailed(true);
      } else if (getAuth.resultCode === 403) {
        setLoginFailed(true);
        setCaptcha(_getTransactionId());
        const onClose = () => {
          _resetAlert();
        };
        _resetAlert();
        setAlertVisible({
          visible: true,
          title: t('alert.title.fail'),
          description: t('alert.text.5번틀림'),
          onClose,
          actions: [
            {
              name: t('alert.button.confirm'),
              action: onClose
            }
          ]
        });
      } else if (getAuth.resultCode === 406) {
        const onClose = () => {
          _resetAlert();
        };
        _resetAlert();
        setAlertVisible({
          visible: true,
          title: t('alert.title.사용제한'),
          description: t('alert.text.사용제한메시지'),
          onClose,
          actions: [
            {
              name: t('alert.button.confirm'),
              action: onClose
            }
          ]
        });
      } else {
        const onClose = () => {
          _resetAlert();
        };
        _resetAlert();
        setAlertVisible({
          visible: true,
          title: t('alert.title.fail'),
          description: t('alert.text.로그인실패'),
          onClose,
          actions: [
            {
              name: t('alert.button.confirm'),
              action: onClose
            }
          ]
        });
      }
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
