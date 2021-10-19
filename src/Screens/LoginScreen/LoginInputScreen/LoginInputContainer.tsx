import React, { RefObject, useEffect, useState } from 'react';
import { Animated, Easing, Platform } from 'react-native';
import LoginInputPresenter from './LoginInputPresenter';
import UserApi from '../../../services/api/LoginApi/UserApi';
import { getT } from '../../../utils/translateManager';
import ServiceCheckApi from '../../../services/api/ServiceCheckApi';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/configureStore';
import { actionCreators as UserActions } from '../../../redux/modules/user';
import {
  actionCreators as RootActions,
  Rootsstate
} from '../../../redux/modules/root';
import { OrientationType, useDeviceOrientationChange } from 'react-native-orientation-locker';
import deviceInfoModule from 'react-native-device-info';

// import { useTranslation } from 'react-i18next';

const LoginInputContainer = () => {
  let _serviceCode: string;
  _serviceCode = Platform.OS === 'ios' ? 'wehagomeet' : 'meet';

  const t = getT();

  const Devices = Platform.OS === 'ios' ? true : false ;
  const isTablet = deviceInfoModule.isTablet() === true;

  const rotate = new Animated.Value(0);
  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });
  
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState<string | null>(null);
  const [captchaInput, setCaptchaInput] = useState('');
  const [logging, setLogging] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isHorizon, setIsHorizon] = useState(false);
  const [alertVisible, setAlertVisible] = useState({
    visible: false,
    description: '',
    onClose: () => {},
    actions: [{ name: '', action: () => {} }],
    title: ''
  });

  const usernameRef: RefObject<any> = React.useRef(null);
  const passwordRef: RefObject<any> = React.useRef(null);
  const captchaRef: RefObject<any> = React.useRef(null);

  const { auth } = useSelector((state: RootState) => {
    return {
      auth: state.user.auth
    };
  });

  const dispatch = useDispatch();
  const loginCheckRequest = (
    AUTH_A_TOKEN: any,
    AUTH_R_TOKEN: any,
    cno: any,
    HASH_KEY: any,
    from: any
  ) =>
    dispatch(
      UserActions.loginCheckRequest(
        AUTH_A_TOKEN,
        AUTH_R_TOKEN,
        cno,
        HASH_KEY,
        from
      )
    );
  const setPermission = (permission: any) =>
    dispatch(UserActions.setPermission(permission));

  const setRootState = (rstate: Rootsstate) =>
    dispatch(RootActions.setRootState(rstate));

  const _handleCheckServce = async (auth: any) => {
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
      const isDeploy = isDeployWehagomeet || isDeployWebrtc;
      setPermission(isDeploy);
      setRootState({
        destination: isDeploy ? 'List' : 'SelectCompany',
        params: {
          accesstype: 'login'
        }
      });
    } else if (statusCheck && statusCheck.code === 400) {
      const onClose = () => {
        _resetAlert();
        setRootState({
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
      setRootState({
        destination: 'SelectCompany'
      });
    }
  };

  useEffect(() => {
    let authR = auth;
    if (Object.keys(authR).length !== 0) {
      _handleCheckServce(authR);
    }
  }, [auth]);

  useDeviceOrientationChange((orientation: OrientationType) => {
    _handleHorizon(orientation);
  });

  const _handleHorizon = (orientation: OrientationType) => {
    const status: boolean =
      orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT';
    setIsHorizon(status);
  };

  const loginchk = async (
    userId: string,
    password: string,
    captcha?: any,
    access_pass: null | string = 'F'
  ) => {
    if (!userId) return usernameRef.current.focus();
    if (!password) return passwordRef.current.focus();
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

      handleChangeCaptcha();
      setLogging(false);
      setPassword('');
      setCaptchaInput('');
      return;
    }

    const UserApiRequest = UserApi;

    const getAuth = await UserApiRequest.loginRequest(
      userId,
      password,
      _serviceCode,
      captcha,
      access_pass
    );

    const tempPw = password.slice();
    setLogging(false);
    setPassword('');
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
            description: t('alert_text_duplicate_login'),
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
          await loginchk(userId, password, captcha, 'T');
          return;
        }
      }

      // 로그인 성공 시
      if (
        getAuth.resultData.viewType &&
        getAuth.resultData.viewType === 'qrcode'
      ) {
        await setCaptcha(null);
        loginchk(userId, tempPw, null);
        return;
      }

      const auth = getAuth.resultData;
      const result = await loginCheckRequest(
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
            description: t('alert_text_duplicate_logout'),
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

  const inputFocusOut = () => {
    if (usernameRef.current.isFocused()) return usernameRef.current.blur();
    else if (passwordRef.current.isFocused()) return passwordRef.current.blur();
    else if (captcha)
      if (captchaRef.current.isFocused()) return captchaRef.current.blur();
  };

  const _resetAlert = () =>
    setAlertVisible({
      visible: false,
      description: '',
      onClose: () => {},
      actions: [],
      title: ''
    });

  const handleChangeCaptcha = () => {
    setCaptcha(_getTransactionId());
    setCaptchaInput('');
  };

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

  const idInput = (text: string) => {
    setUserId(text.trim());
  };

  const pwInput = (text: string) => {
    setPassword(text.trim());
  };

  const clearId = () => setUserId('');
  const clearPw = () => setPassword('');
  

  const cycleAnimated = () => {
    Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out(Easing.poly(1))
      })
    ).start();
  }

  return (
    <LoginInputPresenter
      {...{
        userId,
        idInput,
        usernameRef,
        password,
        pwInput,
        passwordRef,
        loginchk,
        inputFocusOut,
        loginFailed,
        logging,
        alertVisible,
        captcha,
        captchaInput,
        captchaRef,
        setCaptchaInput,
        errorMsg,
        handleChangeCaptcha,
        t,
        cycleAnimated,
        spin,
        isHorizon,
        isTablet,
        clearId,
      }}
    />
  );
};

export default LoginInputContainer;
