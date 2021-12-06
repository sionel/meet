import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import deviceInfoModule from 'react-native-device-info';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/configureStore';

import { actionCreators as UserActions } from '../../redux/modules/user';
import { actionCreators as RootActions } from '../../redux/modules/root';
import { actionCreators as DeployedAcions } from '../../redux/modules/deployed';

import UserApi from '../../services/api/UserApi';

import ConfigurationScreenPresenter from './ConfigurationScreenPresenter';

export default function ConfigurationScreenContainer(props: any) {
  const { auth, from, isHorizon } = useSelector((state: RootState) => {
    const { isHorizon } = state.orientation;

    return {
      auth: state.user.auth,
      from: state.user.from,
      isHorizon
    };
  });

  const dispatch = useDispatch();
  const _logout = () => dispatch(UserActions.logout());
  const _setDestination = (destination: string) =>
    dispatch(RootActions.setDestination(destination));
  const _resetDeployedServices = () =>
    dispatch(DeployedAcions.resetDeployedServices());

  const isTablet = deviceInfoModule.isTablet();

  const _handleRedirect = (destination: string) => {
    props.navigation.navigate(destination);
  };

  const _handleLogout = () => {
    _logout();
    _setDestination('Login');
    _resetDeployedServices();
    from === 'this' && UserApi.logoutRequest(auth);
  };
  const _goBack= () => {
    props.navigation.goBack()
  }
  return (
    <ConfigurationScreenPresenter
      onRedirect={_handleRedirect}
      onLogout={_handleLogout}
      goBack={_goBack}
    />
  );
}

// /**
//  * ConfigurationScreenContainer
//  *
//  * 메인페이지
//  */

// import React from 'react';
// import { Platform } from 'react-native';
// import ConfigurationScreenPresenter from './ConfigurationScreenPresenter';

// import DeviceInfo from 'react-native-device-info';
// import Orientation from 'react-native-orientation-locker';

// import UserApi from '../../services/api/UserApi';

// const hasNotch = DeviceInfo.hasNotch() && Platform.OS === 'ios';

// class ConfigurationScreenContainer extends React.Component {
//   state = {
//     orientation: 'UNKNOWN',
//     subUrl: '',
//     alert: false
//   };

//   handleRedirect = url => {
//     const { navigation } = this.props;
//     navigation.navigate(url);
//   };

//   render() {
//     const { navigation, onDestroyToken, onToggleVisibleAppIntro } = this.props;
//     const { list, webView, alert } = this.state;

//     return (
//       <ConfigurationScreenPresenter
//         navigation={navigation}
//         list={list}
//         subUrl={this.state.subUrl}
//         alert={alert}
//         onRedirect={this.handleRedirect}
//         onLogout={this._handleLogout}
//         onChangeValue={this._handleChangeValue}
//         onDestroyToken={onDestroyToken}
//         onToggleVisibleAppIntro={onToggleVisibleAppIntro}
//         // log={this.props.log}
//         orientation={this.state.orientation}
//         hasNotch={hasNotch}
//       />
//     );
//   } // render

//   _handleOrientation = orientation => {
//     this.setState({ orientation });
//   };

//   _handleChangeValue = (target, value) => {
//     this.setState({ [target]: value });
//   };

//   _handleLogout = async () => {
//     // const { onLogout, navigation } = this.props;
//     const from = this.props.from;
//     this.props.onLogout();
//     this.props.onSetInitialList();
//     from === 'this' && (await UserApi.logoutRequest(this.props.user));
//     this.props.setDestination('Login');
//     this.props.resetDeployedServices();
//     // navigation.navigate('Main');
//   };
// }

// export default ConfigurationScreenContainer;
