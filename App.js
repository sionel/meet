import React, { useEffect } from 'react';
import { AppRegistry, Linking } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import configureStore from './src/redux/configureStore';
import CustomProvider from './src/Provider';
import './jitsi/features/base/lib-jitsi-meet';

import { withTranslation } from 'react-i18next';
import './src/locales/index';
import { setT } from './src/utils/translateManager';

import Splash from 'react-native-splash-screen';
import RootNavigation from '@navigations/RootNavigation';

import { actionCreators as appAction } from './src/redux/modules/app';

import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
  focusManager,
} from 'react-query'

import { useOnlineManager, useAppState } from './src/Hooks';
// Object.prototype.fromEntries = Object.fromEntries || function (arr) {
//   debugger
//   return arr?.reduce(function (acc, curr) {
//     acc[curr[0]] = curr[1];
//     return acc;
//   }, {});
// };
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2 } },
});

function onAppStateChange(status) {
  // React Query already supports in web browser refetch on window focus by default
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

function App(props) {
  const { persistor, store } = configureStore();
  console.reportErrorsAsExceptions = false;

  useOnlineManager();
  useAppState(onAppStateChange);

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
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <CustomProvider>
            <RootNavigation {...props} />
          </CustomProvider>
        </PersistGate>
      </Provider>
    </QueryClientProvider>

  );
}
AppRegistry.registerComponent('App', () => withTranslation()(App));