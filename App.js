import React, { useEffect } from 'react';
import { AppRegistry, Linking } from 'react-native';
import { Provider, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import configureStore from './src/redux/configureStore';
import Main from './src/Main';
import { withTranslation } from 'react-i18next';
import './src/locales/index';
import { setT } from './src/utils/translateManager';

import Splash from 'react-native-splash-screen';
import { actionCreators } from './src/redux/modules/root';

import CustomProvider from './src/Provider';

// import { io } from "socket.io-client";

function App(props) {
  const dispatch = useDispatch();

  useEffect(() => {
    Splash.hide();
    // Linking.getInitialURL().then(url => console.log('getInitialURL : ', url));
    Linking.addEventListener('url', event => {
      // console.log('addEventListener : ', event.url);
      dispatch(actionCreators.setRootState({ loaded: false, url: event.url }));
    });
    setT(props.t);

    // return () => Linking.removeEventListener('url');
  }, []);

  useEffect(() => {
    dispatch(
      actionCreators.setRootState({ loaded: false, url: props?.url?.url })
    );
  }, [props.url]);

  return <Main />;
}

function AppWapper(props) {
  const { persistor, store } = configureStore();
  console.reportErrorsAsExceptions = false;
  store.dispatch({
    type: 'local.SET_EXTERNAL',
    externalAPIScope: props.externalAPIScope
  });
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <CustomProvider>
          <App {...props} />
        </CustomProvider>
      </PersistGate>
    </Provider>
  );
}

// export default withTranslation()(App);
AppRegistry.registerComponent('App', () => withTranslation()(AppWapper));
