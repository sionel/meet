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

import Splash from 'react-native-splash-screen';
import { actionCreators } from './src/redux/modules/local';

import CustomProvider from './src/Provider';

// import { io } from "socket.io-client";

const { persistor, store } = configureStore();
console.reportErrorsAsExceptions = false;

class App extends Component {
  constructor(props) {
    super(props);
    // this.state = { loaded: false, url: props?.url?.url };
    // externalAPIScope: "57ba2032-0393-4359-8543-b758d641e132"
    // i18n을 사용하면 t로 넘겨줌 맨 처음 받는 변수명만 무엇인지 유추 가능하게 적어두고 밑에서부턴 t
    // 만약 언어 선택 옵션창이 생긴다면 훅으로 처리해야하므로  didupdate로 바꿔야지 않을까
    setT(this.props.t);
    // this.state = { loaded: false, url: 'wehago.meet://?login_info=email&type=conference&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2aWRlby53ZWhhZ28uY29tIiwicm9vbSI6IjkxZGY1ZmFlLTQzNTAtNDdiMC1iMTZjLTdmYzk2MzRmMTg1ZCIsImVtYWlsIjoic2FkYjAxMDFAbmF2ZXIuY29tIiwiaWF0IjoxNjA0OTA2MjgxLCJleHAiOjE5MjAyNjYyODF9.lY7h6sYaKfrWBQkGa1pZhSF9auhsRsMuzqQtsBi8evQ' };
  }

  componentDidMount() {
    Splash.hide();
    Linking.addEventListener('url', event => {
      store.dispatch({
        type: 'root.SETROOTSTATE',
        rstate: { loaded: false, url: event.url }
      })
    });

    store.dispatch({
      type: 'local.SET_EXTERNAL',
      externalAPIScope: this.props.externalAPIScope
    });
    // const ws = io("ws://10.70.242.129:8080", {
    //   path: "/wehagomeet",
    //   transports: ["websocket"],
    //   query: {
    //     room: "room1234",
    //     uid: "5114fd61-a596-4903-aa0f-33911a45964a",
    //   },
    // });

    // ws.on("message", (data) => {
    //   debugger
    //   console.log({ data });
    // });

    // ws.emit("hello world", "foo");
  }

  componentDidUpdate(prevProps) {
    // console.log('app did update');
    if (prevProps.url.url !== this.props.url.url) {
      // 타임스태프를 요구할 것
      store.dispatch({
        type: 'root.SETROOTSTATE',
        rstate: { loaded: false, url: this.props.url.url }
      })
      // this.setState({ loaded: false, url: this.props.url.url });
    }
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <CustomProvider>
            <Main />
          </CustomProvider>
        </PersistGate>
      </Provider>
    );
  }


}

export default withTranslation()(App);

AppRegistry.registerComponent('App', () => withTranslation()(App));
