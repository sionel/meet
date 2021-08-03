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

  const _handleCheckServce = async auth => {
    const statusCheck = await ServiceCheckApi.companyStatusCheck(
      auth,
      auth.last_access_company_no
    );
    // 이상이 없는 회사일 경우 로그인 정상 진행
    if (statusCheck && statusCheck.code === 200) {
      // 서비스 구매여부 조회
      const isDeployWebrtc = await ServiceCheckApi.serviceCheck(
        auth,
        'webrtc' // 구매여부 확인
      );
      // 서비스 배포여부 조회
      const isDeployWehagomeet = await ServiceCheckApi.serviceCheck(
        auth,
        'wehagomeet' // 배포여부 확인
      );
      debugger;
      const isDeploy = isDeployWehagomeet || isDeployWebrtc;
      props.setPermission(isDeploy);
      props.onChangeRootState({
        destination: isDeploy ? 'List' : 'SelectCompany',
        params: {
          accesstype: 'login'
        }
      });
    } else if (statusCheck && statusCheck.code === 400) {
      const onClose = () => {
        _resetAlert();
        props.onChangeRootState({
          destination: 'SelectCompany',
          params: {
            accesstype: 'login'
          }
        });
      };
      setAlertVisible({
        visible: true,
        title: t('alert_title_notion'),
        description: statusCheck.message,
        onClose,
        actions: [
          {
            name: t('alert_button_confirm'),
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
        title: t('alert_title_login_fail'),
        description: t('alert_text_incorrect_prevent'),
        onClose,
        actions: [
          {
            name: t('alert_button_confirm'),
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
            title: t('alert_title_notion'),
            description: iswehagov
              ? t('alert_text_duplicate_login_V')
              : t('alert_text_duplicate_login'),
            onClose: () => {
              _resetAlert();
              resolve(false);
            },
            actions: [
              {
                name: t('alert_button_cancel'),
                action: () => {
                  _resetAlert();
                  resolve(false);
                }
              },
              {
                name: t('alert_button_confirm'),
                action: () => {
                  _resetAlert();
                  resolve(true);
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
            title: t('alert_title_notion'),
            description: iswehagov
              ? t('alert_text_expired')
              : t('alert_text_duplicate_logout'),
            onClose,
            actions: [
              {
                name: t('alert_button_confirm'),
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
            title: t('alert_title_notion'),
            description: t('alert_text_login_info_error'),
            onClose,
            actions: [
              {
                name: t('alert_button_confirm'),
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
            title: t('alert_title_notion'),
            description: t('alert_text_no_right'),
            onClose,
            actions: [
              {
                name: t('alert_button_confirm'),
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
            title: t('alert_title_notion'),
            description: t('alert_text_timeover'),
            onClose,
            actions: [
              {
                name: t('alert_button_confirm'),
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
            title: t('alert_title_notion'),
            description: t('alert_text_problem_ocurred'),
            onClose,
            actions: [
              {
                name: t('alert_button_confirm'),
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
          title: t('alert_title_login_fail'),
          description: t('alert_text_incorrect_id'),
          onClose,
          actions: [
            {
              name: t('alert_button_confirm'),
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
          title: t('alert_title_login_fail'),
          description: t('alert_text_five'),
          onClose,
          actions: [
            {
              name: t('alert_button_confirm'),
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
          title: t('alert_title_limit'),
          description: t('alert_text_unable'),
          onClose,
          actions: [
            {
              name: t('alert_button_confirm'),
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
          title: t('alert_title_login_fail'),
          description: t('alert_text_login_fail'),
          onClose,
          actions: [
            {
              name: t('alert_button_confirm'),
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
