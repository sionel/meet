import React, { RefObject, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import LoginInputPresenter from './LoginInputPresenter';
import UserApi from '../../../services/api/LoginApi/UserApi';
import { actionCreators as UserActions } from '../../../redux/modules/user';
import { getT } from '../../../utils/translateManager';
import ServiceCheckApi from '../../../services/api/ServiceCheckApi';

const LoginInputContainer = ({
  loginCheckRequest,
  auth,
  setPermission,
  setRootState
}: any) => {
  let _serviceCode: string;
  _serviceCode = Platform.OS === 'ios' ? 'wehagomeet' : 'meet';

  const t = getT();

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [logging, setLogging] = React.useState(false);
  const [loginFailed, setLoginFailed] = React.useState(false);
  const [alertVisible, setAlertVisible] = React.useState({
    visible: false,
    description: '',
    onClose: () => {},
    actions: [{ name: '', action: () => {} }],
    title: ''
  });

  const usernameRef: RefObject<any> = React.useRef(null);
  const passwordRef: RefObject<any> = React.useRef(null);

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

  const loginchk = async (
    userId: string,
    password: string,
    access_pass: null | string = 'F'
  ) => {
    if (!userId) return usernameRef.current.focus();
    if (!password) return passwordRef.current.focus();

    console.log('here');

    setLogging(true);

    const UserApiRequest = UserApi;

    const getAuth = await UserApiRequest.loginRequest(
      userId,
      password,
      _serviceCode,
      false,
      access_pass
    );

    const tempPw = password.slice();
    setLogging(false);
    setPassword('');

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
          await loginchk(userId, password, 'T');
          return;
        }
      }

      // 로그인 성공 시
      if (
        getAuth.resultData.viewType &&
        getAuth.resultData.viewType === 'qrcode'
      ) {
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
      if (getAuth.resultCode === 401) {
        console.log('ERROR 401');
      }
      if (getAuth.resultCode === 403) {
        setLoginFailed(true);
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

  // const goLogin = () => {
  //   Alert.alert('로그인성공', `userId : ${userId}\npassword : ${password}`, [
  //     { text: '이전페이지로', onPress: goLogin }
  //   ]);
  //   navigation.navigate('Login');
  // };

  const inputFocusOut = () => {
    if (usernameRef.current.isFocused()) return usernameRef.current.blur();
    else if (passwordRef.current.isFocused()) return passwordRef.current.blur();
  };

  const _resetAlert = () =>
    setAlertVisible({
      visible: false,
      description: '',
      onClose: () => {},
      actions: [],
      title: ''
    });

  const idInput = (text: string) => {
    setUserId(text.trim());
  };

  const pwInput = (text: string) => {
    setPassword(text.trim());
  };

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
        alertVisible
      }}
    />
  );
};

export default LoginInputContainer;
