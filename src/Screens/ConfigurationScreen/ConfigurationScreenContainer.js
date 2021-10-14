/**
 * ConfigurationScreenContainer
 *
 * 메인페이지
 */

import React from 'react';
import { Platform } from 'react-native';
import ConfigurationScreenPresenter from './ConfigurationScreenPresenter';

import DeviceInfo from 'react-native-device-info';
import Orientation from 'react-native-orientation-locker';

import UserApi from '../../services/api/UserApi';

const hasNotch = DeviceInfo.hasNotch() && Platform.OS === 'ios';

class ConfigurationScreenContainer extends React.Component {
  state = {
    webView: false,
    orientation: 'UNKNOWN',
    subUrl: '',
    alert: false
  };

  componentDidMount() {
    Orientation.getOrientation(orientation => {
      this.setState({ orientation });
    });
    Orientation.addOrientationListener(this._handleOrientation);
  }

  componentWillUnmount() {
    Orientation.removeOrientationListener(this._handleOrientation);
  }

  handleRedirect = url => {
    const { navigation } = this.props;
    navigation.navigate(url);
  };

  render() {
    const { navigation, onDestroyToken, onToggleVisibleAppIntro } = this.props;
    const { list, webView, alert } = this.state;

    return (
      <ConfigurationScreenPresenter
        navigation={navigation}
        list={list}
        webView={webView}
        subUrl={this.state.subUrl}
        alert={alert}
        onRedirect={this.handleRedirect}
        onLogout={this._handleLogout}
        onChangeValue={this._handleChangeValue}
        onDestroyToken={onDestroyToken}
        onToggleVisibleAppIntro={onToggleVisibleAppIntro}
        // log={this.props.log}
        orientation={this.state.orientation}
        hasNotch={hasNotch}
      />
    );
  } // render

  _handleOrientation = orientation => {
    this.setState({ orientation });
  };

  _handleChangeValue = (target, value) => {
    this.setState({ [target]: value });
  };

  _handleLogout = async () => {
    // const { onLogout, navigation } = this.props;
    const from = this.props.from;
    this.props.onLogout();
    this.props.onSetInitialList();
    from === 'this' && (await UserApi.logoutRequest(this.props.user)); 
    this.props.setRootState({ destination: 'Login' });
    // navigation.navigate('Main');
  };
}

export default ConfigurationScreenContainer;
