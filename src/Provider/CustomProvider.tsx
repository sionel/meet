import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import Alert from './Alert';
import Indicator from './Indicator';
import { useSelector, useDispatch } from 'react-redux';
import Orientation, {
  OrientationType,
  useDeviceOrientationChange
} from 'react-native-orientation-locker';
import { actionCreators as orientationAction } from '../redux/modules/orientation';
import { RootState } from '../redux/configureStore';
import { UserApi } from '../services';

import { getT } from '../utils/translateManager';

import { actionCreators as AlertAcions } from '../redux/modules/alert';
import { actionCreators as UserActions } from '../redux/modules/user';
import { actionCreators as RootActions } from '../redux/modules/root';

export default function CustomProvider(props: any) {
  const { children } = props;
  // const alert = useSelector((state: RootState) => state.alert);
  // const indicator = useSelector((state: RootState) => state.indicator);

  const { alert, indicator, auth, autoLogin, isLogin } = useSelector(
    (state: RootState) => {
      const {
        alert,
        indicator,
        user: { auth, autoLogin, isLogin }
        // autoLogin: state.user.autoLogin,
      } = state;

      return {
        alert,
        indicator,
        auth,
        autoLogin,
        isLogin
      };
    }
  );
  const t = getT();

  const { visible: alertVisible } = alert;
  const { visible: indicatorVisible } = indicator;
  const dispatch = useDispatch();

  const _onLogin = (auth: any, from: any, autoLogin: boolean) =>
    dispatch(UserActions.login(auth, from, autoLogin));
  const _onLogout = () => dispatch(UserActions.logout());

  const _setDestination = (destination: string) =>
    dispatch(RootActions.setDestination(destination));

  const _sessionCheck = (session: boolean) =>
    dispatch(UserActions.sessionCheck(session));
  const _setAlert = (params: any) => dispatch(AlertAcions.setAlert(params));

  // sessionCheck: session => dispatch(UserActions.sessionCheck(session)),

  useEffect(() => {
    console.log('tsetststs');
    const sessionInterval =
      isLogin &&
      setInterval(() => {
        _handleAutoLogin();
      }, 10000);
    return () => {
      sessionInterval && clearInterval(sessionInterval);
    };
  }, [isLogin]);

  const _setOrientation = (orientation: OrientationType) => {
    if (orientation === 'LANDSCAPE-LEFT') {
      Orientation.lockToLandscapeLeft();
    } else if (orientation === 'LANDSCAPE-RIGHT') {
      Orientation.lockToLandscapeRight();
    } else if (
      orientation === 'PORTRAIT' ||
      orientation === 'PORTRAIT-UPSIDEDOWN'
    ) {
      Orientation.lockToPortrait();
    }

    dispatch(orientationAction.setOrientation(orientation));
  };

  const _handleAutoLogin = async () => {
    const checkResult = await _loginCheckRequest();
    // console.log(checkResult);

    if (checkResult?.errors) {
      if (checkResult.errors.code === 'E002') {
        _setAlert({
          type: 1,
          title: t('renewal.alert_title_login_fail'),
          message: t('renewal.alert_text_duplicate_logout')
        });
      } else {
      }
      _setDestination('Login');
      _onLogout();
    }
  };

  const _loginCheckRequest = async () => {
    const { AUTH_A_TOKEN, AUTH_R_TOKEN, cno, HASH_KEY } = auth;

    const checkResult = await UserApi.check(
      AUTH_A_TOKEN,
      AUTH_R_TOKEN,
      cno,
      HASH_KEY
    );
    console.log(checkResult);

    if (checkResult.resultCode === 200) {
      // const userData = {
      //   // login api data
      //   AUTH_A_TOKEN,
      //   AUTH_R_TOKEN,
      //   HASH_KEY,
      //   cno,
      //   // check api data
      //   user_no: checkResult.resultData.user_no,
      //   portal_id: checkResult.resultData.portal_id, // 아이디
      //   user_name: checkResult.resultData.user_name,
      //   user_default_email: checkResult.resultData.user_default_email,
      //   user_email: checkResult.resultData.user_email,
      //   profile_url: checkResult.resultData.profile_url,
      //   user_contact: checkResult.resultData.user_contact,
      //   employee_list: checkResult.resultData.employee_list, // 회사정보
      //   last_access_company_no: checkResult.resultData.last_access_company_no
      //     ? checkResult.resultData.last_access_company_no
      //     : cno,
      //   last_company: checkResult.resultData.last_access_company_no
      //     ? checkResult.resultData.employee_list.filter(
      //         e => e.company_no == checkResult.resultData.last_access_company_no
      //       )[0]
      //     : checkResult.resultData.employee_list[0], // last_access_company_no가 비어있는 상태로 올 수 있어서 null이 뜬다면 리스트중 첫번째 인덱스로 처리
      //   member_type: checkResult.resultData.member_type, // 0: 일반회원, 1: 개인회원
      //   nickname: checkResult.nickname,
      //   membership_code: checkResult.resultData.employee_list[0].membership_code
      // };
      // _onLogin(userData, 'login', autoLogin);
      return {};
    } else {
      const result = checkResult.errors ? checkResult : { errors: checkResult };
      return result;
    }
  };

  useDeviceOrientationChange(_setOrientation);
  return (
    <View style={{ flex: 1, zIndex: 9 }}>
      {alertVisible && <Alert />}
      {indicatorVisible && <Indicator />}
      {children}
    </View>
  );
}
