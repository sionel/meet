import React, { Component } from 'react';
import { AppRegistry, View, Platform, Alert, BackHandler } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import configureStore from './src/redux/configureStore';
import Main from './src/Main';
import LaunchScreen from './src/Screens/LaunchScreen';
import SplashScreen from './src/Screens/SplashScreen';

import ServerNotiveCheck from './src/components/ServerNotiveCheck';
import { WEHAGO_ENV } from './config';
// CallKit
// import { IncomingCallApp } from './jitsi/features/mobile/incoming-call';
// import { AudioRouteButton } from './jitsi/features/mobile/audio-mode';

// 스크린샷 막기 및 백그라운드시 정보 보호 정책

const { persistor, store } = configureStore();

export default class App extends Component {
  state = { loaded: true };

  render() {
    if (this.state.loaded) {
      return (
          <SplashScreen didLoaded={this._changeloaded} />
      );
    }
    // else if (this.state.message.code === '503') {
    //   return <ServerNotiveCheck message={this.state.message} />;
    // }
    else {
      return (
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <Main url={this.props.url} />
          </PersistGate>
        </Provider>
      );
    }
  }

  _changeloaded = loaded => {
    this.setState({ loaded });
  };
}

AppRegistry.registerComponent('App', () => App);
