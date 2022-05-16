import React, { useEffect } from 'react';
import { AppRegistry, Linking } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import configureStore from './src/redux/configureStore';
import CustomProvider from './src/Provider';

import { withTranslation } from 'react-i18next';
import './src/locales/index';
import { setT } from './src/utils/translateManager';

import Splash from 'react-native-splash-screen';
import RootNavigation from '@navigations/RootNavigation';

import { actionCreators as appAction } from './src/redux/modules/app';

// import { io } from "socket.io-client";

function App(props) {
  const { persistor, store } = configureStore();
  console.reportErrorsAsExceptions = false;

  useEffect(() => {

    setExternalAPIScope(props.externalAPIScope);
    setUrl(props?.url?.url ?? '');
    
    setT(props.t);
    Splash.hide();
    Linking.addEventListener('url', ({ url }) => {
      setUrl(url);
    });
  }, []);
  const setExternalAPIScope = externalAPIScope =>
    store.dispatch(appAction.setExternalAPIScope(externalAPIScope));
  const setUrl = url => store.dispatch(appAction.setUrl(url));

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <CustomProvider>
          <RootNavigation {...props} />
        </CustomProvider>
      </PersistGate>
    </Provider>
  );
}
AppRegistry.registerComponent('App', () => withTranslation()(App));