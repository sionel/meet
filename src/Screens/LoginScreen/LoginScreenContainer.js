import React from 'react';
import LoginScreenPresenter from './LoginScreenPresenter';


import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Orientation from 'react-native-orientation-locker';

import LaunchScreen from '../LaunchScreen';

const bg = require('../../../assets/bgIntroWehagoIphoneX_3x.png');



class LoginScreenContainer extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return <LoginScreenPresenter />;
  }
}

export default LoginScreenContainer;
