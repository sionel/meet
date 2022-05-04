import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import deviceInfoModule from 'react-native-device-info';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/configureStore';

import { actionCreators as UserActions } from '../../redux/modules/user';
// import { actionCreators as RootActions } from '../../redux/modules/root';
import { actionCreators as DeployedAcions } from '../../redux/modules/deployed';
import { actionCreators as RecentsActions } from '../../redux/modules/recentsInvited';
import { actionCreators as SelectCompanyActions } from '../../redux/modules/selectCompany';

import UserApi from '../../services/api/UserApi';

import ConfigurationScreenPresenter from './ConfigurationScreenPresenter';
import { ConfigurationNavigationProps } from '../../Navigations/ConfigurationStack';
import { wehagoDummyImageURL, wehagoMainURL } from '../../utils';

export default function ConfigurationScreenContainer(props: any) {
  const { auth, from, isHorizon } = useSelector((state: RootState) => {
    const { isHorizon } = state.orientation;
    return {
      auth: state.user.auth,
      from: state.user.from,
      isHorizon
    };
  });

  const {
    user_name,
    rankname,
    full_path,
    profile_url,
    last_company,
    isFreelancer
  } = auth;

  const authInfo = {
    user_name,
    rankname,
    full_path,
    profile_url: profile_url
      ? wehagoMainURL + profile_url
      : wehagoDummyImageURL,
    companyName: last_company?.company_name_kr,
    isFreelancer
  };
  const { navigation, route }: ConfigurationNavigationProps<'Configuration'> =
    props;

  const [width, setWidth] = useState(Dimensions.get('screen').width);
  const [height, setHeight] = useState(Dimensions.get('screen').height);

  const dispatch = useDispatch();
  const _logout = () => {
    dispatch(UserActions.logout());
    dispatch(RecentsActions.resetRecents());
  };
  const _resetDeployedServices = () =>
    dispatch(DeployedAcions.resetDeployedServices());

  const _openCompany = () => dispatch(SelectCompanyActions.openCompany());

  useEffect(() => {
    const updateLayout = () => {
      setWidth(Dimensions.get('screen').width);
      setHeight(Dimensions.get('screen').height);
    };
    Dimensions.addEventListener('change', updateLayout);
    return () => {
      Dimensions.removeEventListener('change', updateLayout);
    };
  });

  const _handleLogout = () => {
    _logout();
    _resetDeployedServices();
    from === 'this' && UserApi.logoutRequest(auth);
    navigation.reset({ routes: [{ name: 'LoginStack' }] });
  };
  const _goBack = () => {
    navigation.goBack();
  };

  const handleGoPolicy = () => {
    navigation.navigate('Policy');
  };

  const handleGoAwards = () => {
    navigation.navigate('Awards');
  };

  const handleGoOpenSource = () => {
    navigation.navigate('OpenSource');
  };
  return (
    <ConfigurationScreenPresenter
      onLogout={_handleLogout}
      goBack={_goBack}
      handleGoPolicy={handleGoPolicy}
      handleGoAwards={handleGoAwards}
      handleGoOpenSource={handleGoOpenSource}
      authInfo={authInfo}
      onCompanyChange={_openCompany}
      width={width}
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
