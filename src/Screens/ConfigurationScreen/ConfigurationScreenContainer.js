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

const hasNotch = DeviceInfo.hasNotch() && Platform.OS === 'ios';

class ConfigurationScreenContainer extends React.Component {
  /**
   * STATE
   */
  state = {
    webView: false,
    orientation: 'UNKNOWN',
    subUrl: '',
    alert: false
  };

  /**
   * componentDidMount
   */
  componentDidMount() {
    Orientation.getOrientation(orientation => {
      this.setState({ orientation });
    });
    Orientation.addOrientationListener(this._handleOrientation);
  }

  /**
   * componentWillUnmount
   */
  componentWillUnmount() {
    Orientation.removeOrientationListener(this._handleOrientation);
  }

  /**
   * handleRedirect
   * 페이지 이동
   */
  handleRedirect = url => {
    const { navigation } = this.props;
    navigation.navigate(url);
  };

  /**
   * Rendering
   */
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

  /**
   * _handleOrientation
   */
  _handleOrientation = orientation => {
    this.setState({ orientation });
  };

  /**
   * _handleChangeValue
   * 페이지 이동
   */
  _handleChangeValue = (target, value) => {
    this.setState({ [target]: value });
  };

  /**
   * _handleLogout
   * 로그아웃
   */
  _handleLogout = () => {
    // const { onLogout, navigation } = this.props;
    this.props.onLogout();
    this.props.onSetInitialList();
    // navigation.navigate('Main');
  };
}

export default ConfigurationScreenContainer;
