import 'react-native-gesture-handler';
import React, { RefObject, useEffect } from 'react';
import { NavigationContainer, NavigationState } from '@react-navigation/native';
import {
  createStackNavigator,
  StackScreenProps
} from '@react-navigation/stack';

// import SplashView from './SplashView';
import LoginStack from './LoginStack';
import MainStack from './MainStack';
import SettingView from '../Screens/SettingScreen';
import ConferenceStateView from '../Screens/ConferenceStateScreen';
import ConferenceView from '../Screens/ConferenceScreen';
import SelectCompanyView from '../Screens/SelectCompanyScreen';
import SplashView from '../Screens/SplashScreen';

import { Alert, AppState, AppStateStatus, Linking } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/configureStore';

import { actionCreators as ConferenceActions } from '../redux/modules/conference';
import { actionCreators as UserActions } from '../redux/modules/user';
import { querystringParser } from '../utils';
import { JitsiConferenceErrors } from '../../jitsi/features/base/lib-jitsi-meet';
import { getConferenceManager } from '../utils/ConferenceManager';
import { MeetApi } from '../services';
import RNExitApp from 'react-native-exit-app';
import { useDeepLink } from '../Hooks';

// roomToken?: string;
export type MeetParamList = {
  SplashView: {
    deeplink?: string;
  };
  SelectCompany: undefined;
  LoginStack: undefined;
  InputLogin: undefined;
  MainStack: undefined;
  ConferenceStateView: {
    id: string;
    selectedRoomName: string;
  } & (
    | {
        accessType: 'auth';
        from?: string;
      }
    | {
        accessType: 'joincode';
        joincode: string;
      }
    | {
        accessType: 'email';
        emailToken: string;
      }
  );

  SettingView: {
    id: string;
    selectedRoomName: string;
  } & (
    | {
        accessType: 'auth';
      }
    | { accessType: 'joincode'; joincode: string }
    | { accessType: 'email'; emailToken: string }
  );

  ConferenceView: {
    accessType: string;
    callType: number;
    externalUser: any;
    id: string;
    isCreator?: any;
    joincode: string;
    name: string;
    roomToken: string;
    roomType?: string;
    selectedRoomName: string;
    tracks: any;
  };
};

export type MeetNavigationProps<T extends keyof MeetParamList> =
  StackScreenProps<MeetParamList, T>;

const RootStack = createStackNavigator();

const navigationRef: RefObject<any> = React.createRef();

export const navigate = (name: string, params?: any) => {
  navigationRef.current?.navigate(name, params);
};

export const navigateReset = (name: string, params?: any) => {
  navigationRef.current?.reset({
    routes: [
      {
        name,
        params: { ...params }
      }
    ]
  });
};

export const getCurrentRoute = () => {
  return navigationRef.current?.getCurrentRoute();
};

export default function RootNavigation(props: any) {
  // let nowStack = '';
  let cnt = 0;
  const dispatch = useDispatch();
  const setIsConference = (flag: boolean) => {
    dispatch(ConferenceActions.setIsConference(flag));
  };
  const setLoginType = (loginType: string) => {
    dispatch(UserActions.setLoginType(loginType));
  };
  // const [url] = useDeepLink();

  // useEffect(() => {
  //   debugger;
  // }, [url]);

  const { isConference, auth, url } = useSelector((state: RootState) => {
    return {
      auth: state.user.auth,
      isConference: state.conference.isConference,
      url: state.app.url
    };
  });

  const _setAppStateChange = async (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      let wehago = await Linking.canOpenURL('wehago://');
      let nahago = await Linking.canOpenURL('staffmanagment://');
      let loginType = wehago ? 'wehago' : nahago ? 'nahago' : 'none';

      setLoginType(loginType);
    }
  };

  const _handleAppStateChange = () => {
    _setAppStateChange('active');
    AppState.addEventListener('change', _setAppStateChange);
  };

  useEffect(() => {
    _handleGetDeeplink(url);
  }, [url]);

  // const _setLinkingEvent = () => {
  //   // 앱 처음 진입시 (ios / android , deeplink android)
  //   Linking.getInitialURL().then(url => {
  //     url && _handleGetDeeplink({ url });
  //   });

  //   // 앱 실행중일때 (deeplink ios)
  //   Linking.addEventListener('url', _handleGetDeeplink);
  // };

  const _handleGetDeeplink = (url: string) => {
    if (!url) return;
    let { name } = navigationRef.current.getCurrentRoute();
    if (isConference && name === 'ConferenceView') {
      _deeplinkWhenConferenceOngoing();
    } else {
      _deeplinkNormalAccess();
    }
  };

  const _deeplinkWhenConferenceOngoing = () => {
    RNExitApp.exitApp();
  };

  const _deeplinkNormalAccess = () => {
    navigate('SplashView');
  };

  useEffect(() => {
    _handleAppStateChange();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack.Navigator
        initialRouteName="SplashView"
        screenOptions={{ headerShown: false }}
      >
        <RootStack.Screen
          name="SplashView"
          component={SplashView}
          initialParams={props}
        />
        <RootStack.Screen name="LoginStack" component={LoginStack} />
        <RootStack.Screen name="MainStack" component={MainStack} />
        <RootStack.Screen
          name="ConferenceStateView"
          component={ConferenceStateView}
        />
        <RootStack.Screen name="SettingView" component={SettingView} />
        <RootStack.Screen name="ConferenceView" component={ConferenceView} />
        <RootStack.Screen name="SelectCompany" component={SelectCompanyView} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
