import React, { Component, useEffect, useState } from 'react';
import { Platform, Linking, BackHandler, Alert } from 'react-native';
import SplashScreenPresenter from './SplashScreenPresenter';
import { WEHAGO_ENV } from '../../../config';
import { MeetApi, ServiceCheckApi } from '../../services';
import { UserApi } from '../../services';
import RNExitApp from 'react-native-exit-app';

import { querystringParser } from '../../utils';
import jwt_decode from 'jwt-decode';

import { getT } from '../../utils/translateManager';
import { getConferenceManager } from '../../utils/ConferenceManager';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/configureStore';

import { actionCreators as UserActions } from '../../redux/modules/user';
import { actionCreators as DocumentShareActions } from '../../redux/modules/documentShare';
import { actionCreators as WedriveAcions } from '../../redux/modules/wedrive';
import { actionCreators as AlertAcions } from '../../redux/modules/alert';
import { actionCreators as IndicatorAcions } from '../../redux/modules/indicator';
import { actionCreators as RootActions } from '../../redux/modules/root';
import _ from 'lodash';

// const iswehagov = WEHAGO_ENV === 'WEHAGOV';

// const JailMonkey =
//   Platform.OS === 'android' && iswehagov
//     ? require('jail-monkey').default
//     : null;

const SplashScreenContainer = (props: any) => {
  const [state, setState] = useState({
    first: true,
    index: 0,
    servernoti: []
  });
  const [alertVisible, setAlertVisible] = useState({
    visible: false,
    description: '',
    onClose: () => {},
    actions: [{ name: '', action: () => {} }],
    title: ''
  });

  const [time, setTime] = useState<NodeJS.Timeout | null>(null);

  const t = getT();

  //#region  selector
  const {
    auth,
    from,
    permission,
    updateNoti,
    autoLogin,
    loaded,
    destination,
    params,
    url
  } = useSelector((state: RootState) => {
    return {
      auth: state.user.auth,
      from: state.user.from,
      permission: state.user.permission,
      updateNoti: state.user.updateNoti,
      autoLogin: state.user.autoLogin,
      loaded: state.root.loaded,
      destination: state.root.destination,
      params: state.root.params,
      url: state.root.url
    };
  });
  //#endregion

  //#region  dispatch
  const dispatch = useDispatch();
  const onLogin = (auth: any, from: any, autoLogin: boolean) =>
    dispatch(UserActions.login(auth, from, autoLogin));
  const onAgreement = () => dispatch(UserActions.agreement());
  const onLogout = () => dispatch(UserActions.logout());
  const setPermission = (permission: any) =>
    dispatch(UserActions.setPermission(permission));
  const setSharingMode = () => dispatch(DocumentShareActions.setSharingMode());
  const setInitInfo = () => dispatch(WedriveAcions.setInitInfo());
  const toggleUpdateNoti = () => dispatch(UserActions.toggleUpdateNoti());
  const setAlert = (params: any) => dispatch(AlertAcions.setAlert(params));
  const setIndicator = (message: any) =>
    dispatch(IndicatorAcions.setIndicator(message));
  const resetIndicator = () => dispatch(IndicatorAcions.resetIndicator());
  const eventLog = (event: any) => dispatch(UserActions.eventLog(event));
  const setLoaded = (loaded: boolean) =>
    dispatch(RootActions.setLoaded(loaded));
  const setDestination = (destination: string) =>
    dispatch(RootActions.setDestination(destination));
  const setParams = (params: {}) => dispatch(RootActions.setParams(params));
  const setUrl = (url: string) => dispatch(RootActions.setUrl(url));

  //#endregion

  useEffect(() => {
    // 강제종료 했을때를 위한 강제 초기화
    setInitInfo();
    setSharingMode();

    if (url) {
      _handleGetDeeplink(url);
    } else {
      _handleInit();
    }
    // const m = getConferenceManager();

    // setIndicator(m);
    // m?.dispose();
  }, [url]);

  const _handleInit = async () => {
    !autoLogin && onLogout();
    // 버전 확인
    _handleCheckVersion();
    // 노티 확인
    let servernoti: [] = [];
    servernoti = await _handleCheckNotice(servernoti);
    if (servernoti.length > 0) {
      setState({ ...state, servernoti, index: 0 });
    } else {
      const result = await _handleCheckAutoLogin();
      if (result === 'success') {
        setRootState(true, 'List', {
          accesstype: 'login'
        });
      } else if (result === 'dany') {
        setRootState(true, 'SelectCompany', {});
      } else {
        if (result === 'autoLoginFalse') {
          if (auth !== {}) await UserApi.logoutRequest(auth);
        }
        // onLogout();
        setRootState(true, 'Login', {});
      }
    }
  };

  const setRootState = (
    loaded?: any,
    destination?: string,
    params?: {},
    url?: string
  ) => {
    if (loaded !== undefined) {
      setLoaded(loaded);
    }

    if (destination !== undefined) {
      setDestination(destination);
    }

    if (params !== undefined) {
      setParams(params);
    }

    if (url !== undefined) {
      setUrl(url);
    }
  };

  const _setRootState = (
    loaded?: boolean,
    destination?: string,
    params?: {},
    url?: string
  ) => {
    time && clearTimeout(time);
    const tmp = setTimeout(() => {
      setRootState(loaded, destination, params, url);
    }, 2000);
    setTime(tmp);
  };

  const _handleCheckVersion = async () => {
    const os = Platform.OS;
    const majorVersion = 13;
    const result = await MeetApi.checkVersion(os, majorVersion);
    if (!result.resultData.update || result.resultData.dev_mode) return [];
    const title = t('renewal.servernoti_title_update');
    const message = t('renewal.servernoti_message_power_update');
    const marketUrl =
      os === 'ios'
        ? 'https://itunes.apple.com/app/id1455726925?mt=8'
        : 'https://play.google.com/store/apps/details?id=com.wehago.meet';

    await new Promise(() => {
      Alert.alert(title, message, [
        {
          onPress: async () => {
            await Linking.openURL(marketUrl);
            RNExitApp.exitApp();
          },
          text: t('renewal.alert_button_update')
        }
      ]);
    });
  };

  const _handleCheckNotice = async (noti: any) => {
    const result = await MeetApi.checkNotice();
    if (!result) return [];
    // 확인코드 :101
    // 강제종료 코드 : 102
    result.resultData.forEach((e: any) => {
      if (!e.dev_mode) {
        e.buttons = [
          {
            text:
              e.button_type === 102
                ? t('renewal.alert_button_exit')
                : t('renewal.alert_button_confirm'),
            onclick:
              e.button_type === 102
                ? () => RNExitApp.exitApp()
                : () => _handleNextNotice()
          }
        ];
      }
    });
    noti = noti.concat(result.resultData);
    return noti;
  };

  const _handleNextNotice = async () => {
    const { servernoti, index } = state;
    if (servernoti.length === index + 1) {
      const result = await _handleCheckAutoLogin();
      if (result === 'success') {
        _setRootState(true, 'List', {
          accesstype: 'login'
        });
      } else if (result === 'dany') {
        _setRootState(true, 'SelectCompany', {});
      } else {
        onLogout();
        _setRootState(true, 'Login', {});
      }
    } else {
      setState({
        ...state,
        index: index + 1
      });
    }
  };

  //자동로그인
  const _handleCheckAutoLogin = async () => {
    if (autoLogin) {
      if (auth.AUTH_A_TOKEN) {
        const result = await _loginCheckRequest(
          auth.AUTH_A_TOKEN,
          auth.AUTH_R_TOKEN,
          auth.last_access_company_no,
          auth.HASH_KEY,
          from
        );
        if (result.errors) {
          if (result.errors.code === 'E002') {
            setAlert({
              type: 1,
              title: t('renewal.alert_title_login_fail'),
              message: t('renewal.alert_text_duplicate_logout')
            });
          } else if (result.errors.status === '400') {
            setAlert({
              type: 1,
              title: t('renewal.alert_title_login_fail'),
              message: t('renewal.alert_text_login_info_error')
            });
          } else if (result.errors.status === '401') {
            setAlert({
              type: 1,
              title: t('renewal.alert_title_login_fail'),
              message: t('renewal.alert_text_no_right')
            });
          } else if (result.errors.message === 'timeout') {
            setAlert({
              type: 1,
              title: t('renewal.alert_title_login_fail'),
              message: t('renewal.alert_text_timeover')
            });
          } else {
            setAlert({
              type: 1,
              title: t('renewal.alert_title_login_fail'),
              message: t('renewal.alert_text_problem_ocurred')
            });
          }
          return 'fail';
        } else {
          const flag: any = _handleOnLogin(auth);

          if (flag) {
            return 'success';
          } else {
            return 'dany';
          }
        }
      } else {
        return 'fail';
      }
    } else {
      return 'autoLoginFalse';
    }
  };

  //DeepLink로 접근
  const _handleGetDeeplink = async (url: string) => {
    /* 모바일 웹에서 화상회의로 들어올 때 (메신저, meet 둘다 공통)
      login_info= mobile | web | email (모바일은 세션시간 8시간 웹은 3개월 unknown는 비회원)
      type= login | conference | screen

      mPORTAL_ID=sadb0101 // 아이디
      mHASH_KEY=4737240669613779471317246605417595221 // wehago_s
      mAuth_r_token=1jKg3vXzvd5yR6kxKUGgJUYDaMhKcF // r토큰
      mAuth_a_token=Rxhh9pCzoLpB5I1M6m36aqoDe5Ivxu // a토큰
      cno=9 // h_selected_company_no
      
      video_id=a25f15cb-01d9-44cf-bafa-4b7122022cb3 // video chat id
      room_name=123 // talk방 이름
    */
    if (!url) return;
    let result: any = querystringParser(url);
    // 화상회의 요청인지 판별
    if (result.is_creater) {
      // 오래된 딥링크 주소 차단
      setAlert({
        type: 1,
        title: '오류',
        message: 'meet 앱에서 다시 접근 해주시길 바랍니다'
      });
      return;
    } else if (result.mPORTAL_ID && result.cno) {
      //토근정보가 있을때

      const { mHASH_KEY, mAuth_r_token, mAuth_a_token, cno } = result;

      onLogout();
      let info: any;
      info = await _loginCheckRequest(
        mAuth_a_token,
        mAuth_r_token,
        cno,
        mHASH_KEY,
        'login',
        true
      );
      if (info.errors) {
        // TODO:
        if (info.errors.code === 'E002') {
          setAlert({
            type: 1,
            title: t('renewal.alert_title_login_fail'),
            message: t('renewal.alert_text_duplicate_logout')
          });
        } else if (info.errors.status === '400') {
          setAlert({
            type: 1,
            title: t('renewal.alert_title_login_fail'),
            message: t('renewal.alert_text_login_info_error')
          });
        } else if (info.errors.status === '401') {
          setAlert({
            type: 1,
            title: t('renewal.alert_title_login_fail'),
            message: t('renewal.alert_text_no_right')
          });
        } else if (info.errors.message === 'timeout') {
          setAlert({
            type: 1,
            title: t('renewal.alert_title_login_fail'),
            message: t('renewal.alert_text_timeover')
          });
        } else {
          setAlert({
            type: 1,
            title: t('renewal.alert_title_login_fail'),
            message: t('renewal.alert_text_problem_ocurred')
          });
        }
        return 'fail';
      } else {
        _handleOnLogin(info);
      }
    } else if (result.login_info === 'email') {
      //토근정보가 없을때
      let decoded = jwt_decode(result.token);
      /*
      email: "sadb0101@naver.com"
      exp: 1919234662
      iat: 1603874662
      room: "b15091c1-2acd-47f6-aa7c-6a94df0e5a17"
      sub: "video.wehago.com"
      */
      setLoaded(true);
      setDestination('Setting');
      setParams({
        roomId: decoded.room,
        accesstype: 'email',
        token: result.token
      });
      setUrl('');
    }
  };

  const _handleOnLogin = async (auth: any) => {
    // 회사 상태 조회 후 진행
    const statusCheck = await ServiceCheckApi.companyStatusCheck(
      auth,
      auth.last_company
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
      setDestination(isDeploy ? 'List' : 'SelectCompany');
      setParams({
        accesstype: 'login'
      });
    } else if (statusCheck && statusCheck.code === 400) {
      const onClose = () => {
        setDestination('SelectCompany');
        setParams({
          accesstype: 'login'
        });
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

  //로그인 요청
  const _loginCheckRequest = async (
    AUTH_A_TOKEN: string,
    AUTH_R_TOKEN: string,
    cno: string,
    HASH_KEY: string,
    from: string,
    flag = false // 자동로그인
  ) => {
    const checkResult = await UserApi.check(
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

      await onLogin(userData, from, flag);

      return userData;
    } else {
      const result = checkResult.errors ? checkResult : { errors: checkResult };
      eventLog(result);
      return result;
    }
  };

  return (
    <SplashScreenPresenter
      servernoti={state.servernoti[state.index]}
      loaded={loaded}
      children={props.children}
    />
  );
};

export default SplashScreenContainer;

// const _resetAlert = () =>
//   setAlertVisible({
//     visible: false,
//     description: '',
//     onClose: () => {},
//     actions: [],
//     title: ''
//   });
