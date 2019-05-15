import React, { Component } from 'react';
import { AppRegistry, View, AppState, Linking } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import configureStore from './src/redux/configureStore';
import Main from './src/Main';
// CallKit
// import { IncomingCallApp } from './jitsi/features/mobile/incoming-call';
// import { AudioRouteButton } from './jitsi/features/mobile/audio-mode';

const { persistor, store } = configureStore();

export default class App extends Component {
  // state = {
  //   appState: AppState.currentState
  // };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // // 주기적으로 앱 업데이트
    // AppState.addEventListener('change', this._handleAppStateChange);
    console.log(this.props);
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (
  //     this.state.appState.match(/inactive|background/) &&
  //     nextState.appState === 'active'
  //   )
  //     return false;
  //   return true;
  // }

  // componentWillUnmount() {
  //   AppState.removeEventListener('change', this._handleAppStateChange);
  //   if (this.props.url !== nextProps.url) return false;
  //   return true;
  // }

  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Main />
        </PersistGate>
      </Provider>
    );
  }

  // _handleAppStateChange = nextAppState => {
  //   if (
  //     this.state.appState.match(/inactive|background/) &&
  //     nextAppState === 'active'
  //   ) {
  //     Linking.getInitialURL().then(url => {
  //       if (url) {
  //         console.log('url4: ' + url);
  //         // this._handleOpenURL({ url });
  //       } else {
  //         console.log('no url');
  //       }
  //     });
  //   }
  //   this.setState({ appState: nextAppState });
  // };
}

// Register the main/root Component of WehagoMeetView.
AppRegistry.registerComponent('App', () => App);

// Register the main/root Component of IncomingCallView.
// AppRegistry.registerComponent('IncomingCallApp', () => IncomingCallApp);
