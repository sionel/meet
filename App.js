import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { Linking } from 'react-native';
import { PersistGate } from 'redux-persist/es/integration/react';
import configureStore from './src/redux/configureStore';
import Main from './src/Main';
import SplashScreen from './src/Screens/SplashScreen';
import AlertScreen from './src/Screens/AlertScreen';

import { withTranslation } from 'react-i18next';
import './src/locales';
import { setT } from './src/utils/translateManager';

const { persistor, store } = configureStore();
console.reportErrorsAsExceptions = false;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { loaded: false, url: props?.url?.url };
    
    // i18n을 사용하면 t로 넘겨줌 맨 처음 받는 변수명만 무엇인지 유추 가능하게 적어두고 밑에서부턴 t
    // 만약 언어 선택 옵션창이 생긴다면 훅으로 처리해야하므로  didupdate로 바꿔야지 않을까
    setT(this.props.t); 
    // this.state = { loaded: false, url: 'wehago.meet://?login_info=email&type=conference&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2aWRlby53ZWhhZ28uY29tIiwicm9vbSI6IjkxZGY1ZmFlLTQzNTAtNDdiMC1iMTZjLTdmYzk2MzRmMTg1ZCIsImVtYWlsIjoic2FkYjAxMDFAbmF2ZXIuY29tIiwiaWF0IjoxNjA0OTA2MjgxLCJleHAiOjE5MjAyNjYyODF9.lY7h6sYaKfrWBQkGa1pZhSF9auhsRsMuzqQtsBi8evQ' };
  }

  componentDidMount() {
    Linking.addEventListener('url', event => {
      this.setState({ loaded: false, url: event.url });
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.url.url !== this.props.url.url) {
      // 타임스태프를 요구할 것
      this.setState({ loaded: false, url: this.props.url.url });
    }
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <AlertScreen>
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
                t={this.translation}
              />
            )}
          </AlertScreen>
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

export default withTranslation()(App);

AppRegistry.registerComponent('App', () => withTranslation()(App));
