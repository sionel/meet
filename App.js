import React, { useEffect } from 'react';
import { Alert, AppRegistry, Linking } from 'react-native';
import { Provider, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import configureStore from './src/redux/configureStore';
import CustomProvider from './src/Provider';

import { withTranslation } from 'react-i18next';
import './src/locales/index';
import { setT } from './src/utils/translateManager';

import Splash from 'react-native-splash-screen';
import RootNavigation from '@navigations/RootNavigation';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import ConferenceScreen from '@screens/ConferenceScreen_New';

import { actionCreators as appAction } from './src/redux/modules/app';

// import { io } from "socket.io-client";

function App(props) {
  const dispatch = useDispatch();

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

  // useEffect(() => {
  //   dispatch(actionCreators.setUrl(props?.url?.url));
  // //     ios : 앱이 꺼져있을때(딥링크)
  // // android : 앱이 꺼져있을때, 앱 켜져 있을때(딥링크)

  //   //  dispatch(actionCreators.setUrl("com.wehago.meet://?login_info=email&type=conference&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2aWRlby53ZWhhZ28uY29tIiwicm9vbSI6ImZiYjY2MTliLWFlMmYtNDE0MS05MmNjLTA3NWEyOTBkZWVjNyIsImVtYWlsIjoieWVvbmdpbDQ3NjRAbmF2ZXIuY29tIiwiaWF0IjoxNjM1NzQ3OTY3LCJleHAiOjE5NTExMDc5Njd9.O6UMML-qjav_-rkvLb-6tZvY-NYctt6Yxy0TF03gfxU&timeStamp=1635750152425"));
  // }, [props.url]);
  // return <ConferenceScreen />
  return <RootNavigation {...props} />;
}

// const test = async () =>{
//   console.log('a');
//   const a=  await Linking.canOpenURL('wehago://?')
//   console.log(a);
// }

function AppWapper(props) {
  const { persistor, store } = configureStore();
  console.reportErrorsAsExceptions = false;
  store.dispatch({
    type: 'conference.SET_EXTERNAL',
    externalAPIScope: props.externalAPIScope
  });
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
// gestureHandlerRootHOC()
AppRegistry.registerComponent('App', () => withTranslation()(AppWapper));
