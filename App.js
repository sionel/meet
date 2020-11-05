import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { Linking } from 'react-native';
import { PersistGate } from 'redux-persist/es/integration/react';
import configureStore from './src/redux/configureStore';
import Main from './src/Main';
import SplashScreen from './src/Screens/SplashScreen';

// 스크린샷 막기 및 백그라운드시 정보 보호 정책
const { persistor, store } = configureStore();

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { loaded: false, url: props.url.url };
  }

  componentDidMount() {
    Linking.addEventListener('url', event => {
      debugger;
      this.setState({ loaded: false, url: event.url });
    });
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          {this.state.loaded ? (
            <Main
              destination={this.state.destination}
              params={this.state.params}
              onChangeRootState={this._handleChangeRootState}
            />
          ) : (
            <SplashScreen
              onChangeRootState={this._handleChangeRootState}
              url={this.state.url}
            />
          )}
        </PersistGate>
      </Provider>
    );
  }

  _handleChangeRootState = param => {
    this.setState({
      ...this.state,
      ...param
    });
  };
}

AppRegistry.registerComponent('App', () => App);
