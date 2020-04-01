import React, { Component } from 'react';
import { AppRegistry, View, Text } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import configureStore from './src/redux/configureStore';
import Main from './src/Main';
import ServerNotiveCheck from './src/components/ServerNotiveCheck';
// CallKit
// import { IncomingCallApp } from './jitsi/features/mobile/incoming-call';
// import { AudioRouteButton } from './jitsi/features/mobile/audio-mode';

const { persistor, store } = configureStore();

if (process.env.NODE_ENV !== 'development') {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
  console.info = () => {};
  console.time = () => {};
}

export default class App extends Component {
  state = { loading: true, message: {} };

  componentDidMount = () => {
    this.handleCheckNotice();
  };

  handleCheckNotice = async () => {
    try {
      const url =
        'https://raw.githubusercontent.com/GiDuck/check-service/master/check.json';
      const response = await fetch(url);
      const message = await response.json();
      this.setState({ loading: false, message });
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  render() {
    if (this.state.loading) {
      return (
        <View>
          <Text>로딩중</Text>
        </View>
      );
    } else if (this.state.message.code === '503') {
      return <ServerNotiveCheck message={this.state.message} />;
    } else {
      return (
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <Main url={this.props.url} />
          </PersistGate>
        </Provider>
      );
    }
  }
}

// Register the main/root Component of WehagoMeetView.
AppRegistry.registerComponent('App', () => App);

// Register the main/root Component of IncomingCallView.
// AppRegistry.registerComponent('IncomingCallApp', () => IncomingCallApp);
