import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import configureStore from './src/redux/configureStore';
import Main from './src/Main';
// CallKit
// import { IncomingCallApp } from './jitsi/features/mobile/incoming-call';
// import { AudioRouteButton } from './jitsi/features/mobile/audio-mode';

const { persistor, store } = configureStore();

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Main url={this.props.url} />
        </PersistGate>
      </Provider>
    );
  }
}

// Register the main/root Component of WehagoMeetView.
AppRegistry.registerComponent('App', () => App);

// Register the main/root Component of IncomingCallView.
// AppRegistry.registerComponent('IncomingCallApp', () => IncomingCallApp);
