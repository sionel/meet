import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Orientation from 'react-native-orientation-locker';

import LaunchScreen from '../LaunchScreen';

const bg = require('../../../assets/bgIntroWehagoIphoneX_3x.png');

export default function LoginCheckScreenPresenter(props) {
  const [waiting, setWaiting] = useState(true);

  const _handleCheckUser = async () => {
    const { auth, loginCheckRequest } = props;
    if (auth.AUTH_A_TOKEN) {
      const result = await loginCheckRequest(
        auth.AUTH_A_TOKEN,
        auth.AUTH_R_TOKEN,
        auth.last_access_company_no,
        auth.HASH_KEY,
        props.isWehagoLogin
      );

      setTimeout(() => {
        if (result.errors) {
          switch (result.errors.code) {
            case 'E002':
              setWaiting(false);
              // return Alert.alert(
              //   '로그아웃',
              //   '고객님의 다른 기기에서 저 접속정보가 확인되어 로그아웃 됩니다.'
              // );
              return;
            default:
              return setWaiting(false);
          }
        } else {
          return props.screenProps.handleOnLogin();
        }
      }, 1000);
    } else {
      return setTimeout(() => {
        setWaiting(false);
      }, 1000);
    }
  };

  useEffect(() => { 
    const isTablet = DeviceInfo.isTablet();
    isTablet
      ? Orientation.unlockAllOrientations()
      : Orientation.lockToPortrait();

    _handleCheckUser();
  }, []);

  if (waiting) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f79bd8' }}>
        <View
        style={{ backgroundColor: '#f79bd8'}}
        ></View>
        <LaunchScreen bg={bg} />
      </View>
    );
  }

  return props.children;
}
