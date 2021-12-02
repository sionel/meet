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
import RootNavigation_new from './src/Navigations/RootNavigation_new';

// import { io } from "socket.io-client";

function App(props) {
  const dispatch = useDispatch();

  useEffect(() => {
    Splash.hide();
    Linking.addEventListener('url', event => {
      dispatch(actionCreators.setLoaded(false));
      dispatch(actionCreators.setUrl(event.url));
    });
    setT(props.t);

    test()
  }, []);

  // const test = async () =>{
  //   console.log('a');
  //   const a=  await Linking.canOpenURL('wehago://?')
  //   console.log(a);
  // } 
  useEffect(() => {
    dispatch(actionCreators.setLoaded(false));
    dispatch(actionCreators.setUrl(props?.url?.url));
    // dispatch(actionCreators.setUrl("com.wehago.meet://?login_info=email&type=conference&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2aWRlby53ZWhhZ28uY29tIiwicm9vbSI6ImZiYjY2MTliLWFlMmYtNDE0MS05MmNjLTA3NWEyOTBkZWVjNyIsImVtYWlsIjoieWVvbmdpbDQ3NjRAbmF2ZXIuY29tIiwiaWF0IjoxNjM1NzQ3OTY3LCJleHAiOjE5NTExMDc5Njd9.O6UMML-qjav_-rkvLb-6tZvY-NYctt6Yxy0TF03gfxU&timeStamp=1635750152425"));
  }, [props.url]);

  return <RootNavigation_new />;
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
AppRegistry.registerComponent('App', () => withTranslation()(AppWapper));
