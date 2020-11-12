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
console.reportErrorsAsExceptions = false;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { loaded: false, url: props.url.url };
    // this.state = { loaded: false, url: 'wehago.meet://?login_info=email&type=conference&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2aWRlby53ZWhhZ28uY29tIiwicm9vbSI6IjkxZGY1ZmFlLTQzNTAtNDdiMC1iMTZjLTdmYzk2MzRmMTg1ZCIsImVtYWlsIjoic2FkYjAxMDFAbmF2ZXIuY29tIiwiaWF0IjoxNjA0OTA2MjgxLCJleHAiOjE5MjAyNjYyODF9.lY7h6sYaKfrWBQkGa1pZhSF9auhsRsMuzqQtsBi8evQ' };
  }

  componentDidMount() {
    Linking.addEventListener('url', event => {
      this.setState({ loaded: false, url: event.url });
    });
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.url.url && this.props.url.url) {
      this.setState({ loaded: false, url: this.props.url.url });
    }
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
              // url={
              //   'wehago.meet://?call_type=1&type=conference&video_id=ad_MEETXNGPKOWZFJPG_20201109141646h0386&mPORTAL_ID=hancho01&mHASH_KEY=111662869701943769610280347764687033287&mAuth_r_token=mJXqT58MIeGhYeRbSSjK3mMjPAFbDK&mAuth_a_token=qDQCl3EZB3glAxHNk5rk0hdC3g3KMK&cno=9'
              // }
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
