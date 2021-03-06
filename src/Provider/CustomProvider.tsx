import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';

import Alert from './Alert';
import Indicator from './Indicator';
import CompanyChange from './CompanyChange';

import { useSelector, useDispatch } from 'react-redux';
import Orientation, {
  OrientationType,
  useDeviceOrientationChange
} from 'react-native-orientation-locker';
import { actionCreators as orientationAction } from '../redux/modules/orientation';
import { RootState } from '../redux/configureStore';
import { UserApi, ServiceCheckApi } from '../services';

import { actionCreators as AlertActions } from '../redux/modules/alert';
import { actionCreators as UserActions } from '../redux/modules/user';
import { actionCreators as RootActions } from '../redux/modules/root';
import { actionCreators as DeployedActions } from '../redux/modules/deployed';
import deviceInfoModule from 'react-native-device-info';
import * as RootNavigation from '../Navigations/RootNavigation';
import { getConferenceManager } from '../utils/ConferenceManager';
import { getT } from '../utils/translateManager';

export default function CustomProvider(props: any) {
  const { children } = props;
  const {
    alert,
    indicator,
    auth,
    isLogin,
    network,
    selectCompany,
    isHorizon,
    isConference
  } = useSelector((state: RootState) => {
    const {
      alert,
      indicator,
      selectCompany,
      user: { auth, isLogin },
      root: { network },
      orientation: { isHorizon },
      conference: { isConference }
    } = state;
    return {
      alert,
      indicator,
      auth,
      isLogin,
      network,
      selectCompany,
      isHorizon,
      isConference
    };
  });
  const t = getT();

  const { visible: alertVisible } = alert;
  const { visible: indicatorVisible } = indicator;
  const { visible: selectCompanyVisible } = selectCompany;

  const dispatch = useDispatch();
  const _onLogout = () => dispatch(UserActions.logout());
  const _setNetwork = (flag: boolean) => dispatch(RootActions.setNetwork(flag));
  const _setAlert = (params: any) => dispatch(AlertActions.setAlert(params));

  const _setDeployedServices = (params: any) =>
    dispatch(DeployedActions.setDeployedServices(params));

  // const [sessionInterval, setSessionInterval] = useState();
  

  useEffect(() => {
    const interval =
      isLogin &&
      network &&
      auth.cno !== undefined &&
      setInterval(() => {
         _loginCheckRequest();
      }, 10000);
    // setSessionInterval(interval);

    // (!isLogin || !network || auth.cno === undefined) && sessionInterval && clearInterval(sessionInterval);

    return () => {
      interval && clearInterval(interval);
    };
  }, [isLogin, network]);

  useEffect(() => {
    isLogin && _checkDeployedServices();
  }, [auth, isLogin]);
  const _checkDeployedServices = async () => {
    // Promise.all([
    //   ServiceCheckApi.serviceCheck(
    //     auth,
    //     'webrtc' // ???????????? ??????
    //   )
    // ])
    // const isDeployWebrtc = await
    // const isDeploywebrtc = await ServiceCheckApi.serviceCheck(
    //   auth,
    //   'webrtc' // ???????????? ??????
    // );
    // // // ????????? ???????????? ??????
    // const isDeployWehagomeet = await ServiceCheckApi.serviceCheck(
    //   auth,
    //   'wehagomeet' // ???????????? ??????
    // );

    // const isDeploy = isDeployWehagomeet || isDeployWebrtc;
    // setPermission(isDeploy);
    // setParams({
    //   accesstype: 'login'
    // });
    // setDestination(isDeploy ? 'List' : 'SelectCompany');

    const isDeployedServices = ['wehago'];
    Promise.all([
      ServiceCheckApi.anotherServiceCheck(
        auth,
        auth.last_company,
        'neors'
      ).then(res => {
        res && isDeployedServices.push('neors');
      }),
      ServiceCheckApi.anotherServiceCheck(
        auth,
        auth.last_company,
        'wedrive'
      ).then(res => {
        res && isDeployedServices.push('wedrive');
      }),
      ServiceCheckApi.anotherServiceCheck(
        auth,
        auth.last_company,
        'attendance'
      ).then(res => {
        res && isDeployedServices.push('attendance');
      }),
      ServiceCheckApi.anotherServiceCheck(
        auth,
        auth.last_company,
        'eapprovals'
      ).then(res => {
        res && isDeployedServices.push('eapprovals');
      })
    ]).then(res => {
      _setDeployedServices(isDeployedServices);
    });
  };

  const _setOrientation = (orientation: OrientationType) => {
    if (!deviceInfoModule.isTablet() && !isConference) {
      Orientation.lockToPortrait();
    } else {
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
    }
  };
  const _loginCheckRequest = async () => {
    const { AUTH_A_TOKEN, AUTH_R_TOKEN, cno, HASH_KEY } = auth;
    console.log('???????????? ' + cno);
    
    const checkResult = await UserApi.check(
      AUTH_A_TOKEN,
      AUTH_R_TOKEN,
      cno,
      HASH_KEY
    );
    if (checkResult.errors) {
      const { name } = RootNavigation.getCurrentRoute();
      // console.log('RootNavigation.getCurrentRoute() : ', RootNavigation.getCurrentRoute());
      if (checkResult.errors.code === 'E002') {
        if (name === 'ConferenceView') {
          let conferenceManager = getConferenceManager();
          conferenceManager._endCall();
        }
        _setAlert({
          type: 1,
          title: t('renewal.alert_title_notion'),
          message: t('renewal.alert_text_duplicate_logout'),
          onConfirm: () => {
            _onLogout();
            RootNavigation.navigateReset('LoginStack');
          }
        });
      } else {
        _setAlert({
          type: 1,
          title: t('renewal.alert_title_notion'),
          message: t('renewal.alert_text_network_problem_ocurred'),
          onConfirm: () => {
            _onLogout();
            RootNavigation.navigateReset('LoginStack');
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
      {selectCompanyVisible && <CompanyChange />}
      {children}
    </View>
  );
}
