import React, { RefObject, useEffect, useState } from 'react';
import { Animated, Easing, Platform } from 'react-native';
import LoginInputPresenter from './LoginInputPresenter';
import UserApi from '../../../services/api/LoginApi/UserApi';
import { UserApi as UserApi2 } from '../../../services';
import { getT } from '../../../utils/translateManager';
import ServiceCheckApi from '../../../services/api/ServiceCheckApi';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/configureStore';
import { actionCreators as UserActions } from '../../../redux/modules/user';
import { actionCreators as RootActions } from '../../../redux/modules/root';
import Orientation, {
  OrientationType,
  useDeviceOrientationChange
} from 'react-native-orientation-locker';
import deviceInfoModule from 'react-native-device-info';

// import { useTranslation } from 'react-i18next';

const LoginInputContainer = () => {
  let _serviceCode: string;
  _serviceCode = Platform.OS === 'ios' ? 'wehagomeet' : 'meet';

  const t = getT();
  const isTablet = deviceInfoModule.isTablet() === true;

  const rotate = new Animated.Value(0);
  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const [userId, setUserId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [captcha, setCaptcha] = useState<string | null>(null);
  const [captchaInput, setCaptchaInput] = useState<string>('');
  const [logging, setLogging] = useState<boolean>(false);
  const [loginFailed, setLoginFailed] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isHorizon, setIsHorizon] = useState<boolean>(false);
  const [check, setCheck] = useState<boolean>(false);
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

  //selector
  const { auth } = useSelector((state: RootState) => {
    return {
      auth: state.user.auth
    };
  });
  //

  //dispatch
  const dispatch = useDispatch();
  const setPermission = (permission: any) =>
    dispatch(UserActions.setPermission(permission));

  const setLoaded = (loaded: boolean) =>
    dispatch(RootActions.setLoaded(loaded));
  const setDestination = (destination: string) =>
    dispatch(RootActions.setDestination(destination));
  const setParams = (params: {}) => dispatch(RootActions.setParams(params));
  const setUrl = (url: string) => dispatch(RootActions.setUrl(url));

  const login = (auth: any, from: any, chk: boolean) => {
    dispatch(UserActions.login(auth, from, chk));
  };
  const logout = () => dispatch(UserActions.logout());
  const eventLog = (evnet: any) => dispatch(UserActions.eventLog(evnet));
  // const setAuth = (auth: any) => dispatch(UserActions.setAuth(auth));
  //

  useEffect(() => {
    let authR = auth;
    if (Object.keys(authR).length !== 0) {
      _handleCheckService(authR);
    }
  }, [auth]);

  useDeviceOrientationChange((orientation: OrientationType) => {
    _handleHorizon(orientation);
  });

  const _handleCheckService = async (auth: any) => {
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
      setParams({
        accesstype: 'login'
      });
      setDestination(isDeploy ? 'List' : 'SelectCompany');
      
    } else if (statusCheck && statusCheck.code === 400) {
      const onClose = () => {
        _resetAlert();
        setParams({accesstype: 'login'});
        setDestination('SelectCompany');
        
      };
      setAlertVisible({
        visible: true,
        title: t('renewal.alert_title_notion'),
        description: statusCheck.message,
        onClose,
        actions: [
          {
            name: t('renewal.alert_button_confirm'),
            action: onClose
          }
        ]
      });
    } else {
      setDestination('SelectCompany');
    }
  };

  const _handleHorizon = (orientation: OrientationType) => {
    if (orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT') {
      setIsHorizon(true);
      Orientation.unlockAllOrientations();
    } else if (
      orientation === 'PORTRAIT-UPSIDEDOWN' ||
      orientation === 'PORTRAIT'
    ) {
      setIsHorizon(false);
      Orientation.lockToPortrait();
    }
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
        title: t('renewal.alert_title_login_fail'),
        description: t('renewal.alert_text_incorrect_prevent'),
        onClose,
        actions: [
          {
            name: t('renewal.alert_button_confirm'),
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
            title: t('renewal.alert_title_notion'),
            description: t('renewal.alert_text_duplicate_login'),
            onClose: () => {
              _resetAlert();
              resolve(false);
            },
            actions: [
              {
                name: t('renewal.alert_button_cancel'),
                action: () => {
                  _resetAlert();
                  resolve(false);
                }
              },
              {
                name: t('renewal.alert_button_confirm'),
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
          loginchk(userId, password, captcha, 'T');
          return;
        }
      }
      // if (
      //   getAuth.resultData.viewType &&
      //   getAuth.resultData.viewType === 'qrcode'
      // ) {
      //   await setCaptcha(null);
      //   loginchk(userId, tempPw, null);
      //   return;
      // }

      // 로그인 성공 시
      const auth = getAuth.resultData;
      _loginApiRequest(auth);
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
          title: t('renewal.alert_title_login_fail'),
          description: t('renewal.alert_text_incorrect_id'),
          onClose,
          actions: [
            {
              name: t('renewal.alert_button_confirm'),
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
          title: t('renewal.alert_title_login_fail'),
          description: t('renewal.alert_text_five'),
          onClose,
          actions: [
            {
              name: t('renewal.alert_button_confirm'),
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
          title: t('renewal.alert_title_limit'),
          description: t('renewal.alert_text_unable'),
          onClose,
          actions: [
            {
              name: t('renewal.alert_button_confirm'),
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
          title: t('renewal.alert_title_login_fail'),
          description: t('renewal.alert_text_login_fail'),
          onClose,
          actions: [
            {
              name: t('renewal.alert_button_confirm'),
              action: onClose
            }
          ]
        });
      }
    }
  };

  const _loginApiRequest = async (auth: any) => {
    const result = await _loginCheckRequest(
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
          logout();
        };

        _resetAlert();
        setAlertVisible({
          visible: true,
          title: t('renewal.alert_title_notion'),
          description: t('renewal.alert_text_duplicate_logout'),
          onClose,
          actions: [
            {
              name: t('renewal.alert_button_confirm'),
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
          title: t('renewal.alert_title_notion'),
          description: t('renewal.alert_text_login_info_error'),
          onClose,
          actions: [
            {
              name: t('renewal.alert_button_confirm'),
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
          title: t('renewal.alert_title_notion'),
          description: t('renewal.alert_text_no_right'),
          onClose,
          actions: [
            {
              name: t('renewal.alert_button_confirm'),
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
          title: t('renewal.alert_title_notion'),
          description: t('renewal.alert_text_timeover'),
          onClose,
          actions: [
            {
              name: t('renewal.alert_button_confirm'),
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
          title: t('renewal.alert_title_notion'),
          description: t('renewal.alert_text_problem_ocurred'),
          onClose,
          actions: [
            {
              name: t('renewal.alert_button_confirm'),
              action: onClose
            }
          ]
        });
      }
      return;
    }
  };

  const _loginCheckRequest = async (
    AUTH_A_TOKEN: any,
    AUTH_R_TOKEN: any,
    cno: any,
    HASH_KEY: any,
    from: any
  ) => {
    const checkResult = await UserApi2.check(
      AUTH_A_TOKEN,
      AUTH_R_TOKEN,
      cno,
      HASH_KEY
    );

    if (checkResult.resultCode === 200) {
      const userData = {
        // login api data
        AUTH_A_TOKEN,
        AUTH_R_TOKEN,
        HASH_KEY,
        cno,
        // check api data
        user_no: checkResult.resultData.user_no,
        portal_id: checkResult.resultData.portal_id, // 아이디
        user_name: checkResult.resultData.user_name,
        user_default_email: checkResult.resultData.user_default_email,
        user_email: checkResult.resultData.user_email,
        profile_url: checkResult.resultData.profile_url,
        user_contact: checkResult.resultData.user_contact,
        employee_list: checkResult.resultData.employee_list, // 회사정보
        last_access_company_no: checkResult.resultData.last_access_company_no
          ? checkResult.resultData.last_access_company_no
          : cno,
        last_company: checkResult.resultData.last_access_company_no
          ? checkResult.resultData.employee_list.filter(
              (e: any) =>
                e.company_no == checkResult.resultData.last_access_company_no
            )[0]
          : checkResult.resultData.employee_list[0], // last_access_company_no가 비어있는 상태로 올 수 있어서 null이 뜬다면 리스트중 첫번째 인덱스로 처리
        member_type: checkResult.resultData.member_type, // 0: 일반회원, 1: 개인회원
        nickname: checkResult.nickname,
        membership_code: checkResult.resultData.employee_list[0].membership_code
      };
      login(userData, from, check);
      return checkResult;
    } else {
      const result = checkResult.errors ? checkResult : { errors: checkResult };
      eventLog(result);
      return result;
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

  const onChangeId = (text: string) => {
    setUserId(text.trim());
  };

  const onChangePw = (text: string) => {
    setPassword(text.trim());
  };

  const onCheck = () => {
    setCheck(!check);
  };

  const clearId = () => setUserId('');

  const cycleAnimated = () => {
    Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out(Easing.poly(1))
      })
    ).start();
  };

  cycleAnimated();

  return (
    <LoginInputPresenter
      {...{
        userId,
        onChangeId,
        usernameRef,
        password,
        onChangePw,
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
        onCheck,
        check
      }}
    />
  );
};

export default LoginInputContainer;
