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
  const { alert, indicator, auth, isLogin, network } = useSelector(
    (state: RootState) => {
      const {
        alert,
        indicator,
        user: { auth, isLogin },
        root: { network }
      } = state;

      return {
        alert,
        indicator,
        auth,
        isLogin,
        network
      };
    }
  );
  const t = getT();

  const { visible: alertVisible } = alert;
  const { visible: indicatorVisible } = indicator;

  const dispatch = useDispatch();
  const _onLogout = () => dispatch(UserActions.logout());
  const _setDestination = (destination: string) =>
    dispatch(RootActions.setDestination(destination));
  const _setNetwork = (flag: boolean) => dispatch(RootActions.setNetwork(flag));
  const _setAlert = (params: any) => dispatch(AlertAcions.setAlert(params));

  const [sessionInterval, setSessionInterval] = useState();

  useEffect(() => {
    const interval =
      isLogin &&
      network &&
      setInterval(() => {
        _loginCheckRequest();
      }, 10000);
    setSessionInterval(interval);

    (!isLogin || !network) && sessionInterval && clearInterval(sessionInterval);

    return () => {
      sessionInterval && clearInterval(sessionInterval);
    };
  }, [isLogin, network]);

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
  const _loginCheckRequest = async () => {
    const { AUTH_A_TOKEN, AUTH_R_TOKEN, cno, HASH_KEY } = auth;

    const checkResult = await UserApi.check(
      AUTH_A_TOKEN,
      AUTH_R_TOKEN,
      cno,
      HASH_KEY
    );
    // console.log(checkResult);
    if (checkResult.errors) {
      if (checkResult.errors.code === 'E002') {
        _setAlert({
          type: 1,
          title: t('renewal.alert_title_error'),
          message: t('renewal.alert_text_duplicate_logout'),
          onConfirm: () => {
            _setDestination('Login');
            _onLogout();
          }
        });
      } else {
        _setAlert({
          type: 1,
          title: t('renewal.alert_title_error'),
          message: t('renewal.alert_text_network_problem_ocurred'),
          onConfirm: () => {
            _setDestination('Login');
            _onLogout();
          }
        });
      }
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
