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

  const { isConference, auth } = useSelector((state: RootState) => {
    return {
      auth: state.user.auth,
      isConference: state.conference.isConference
    };
  });

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      let wehago = await Linking.canOpenURL('wehago://');
      let nahago = await Linking.canOpenURL('staffmanagment://');
      let loginType = wehago ? 'wehago' : nahago ? 'nahago' : 'none';

      setLoginType(loginType);
    }
  };

  useEffect(() => {
    handleAppStateChange('active');
    AppState.addEventListener('change', handleAppStateChange);
    // TODO: 안드로이드 => 리액트 네이티브가 액티비티가 1개라서 위하고에서 Meet으로 올때 App이 재시작됨
    // 위하고 측에서 딥링크 넘겨줄때 위하고 앱측에서 launchMode 방식에서 생기는 현상인거 같음 ?
    if (isConference) {
      Alert.alert('허용되지 않은 접근', '앱이 재시작됩니다.');
      setIsConference(false);
      return;
    }

    if (props.url?.url) {
      // console.log('딥링크 인데 Linking 분기 안탐');
      navigate('SplashView', { deeplink: props.url.url });
    }

    // 앱이 꺼져 있을때(딥링크)
    Linking.getInitialURL()
      .then(url => {
        // console.log('앱이 꺼져 있을때(딥링크)');
        url && navigate('SplashView', { deeplink: url });
      })
      .catch(err => console.error('error ', err));

    // 앱이 이미 실행중일때(딥링크)
    Linking.addEventListener('url', async ({ url }) => {
      let { name } = navigationRef.current.getCurrentRoute();
      // console.log('앱이 이미 실행중일때(딥링크)');
      if (name === 'ConferenceView') {
        Alert.alert('경고', '이미 진행중인 회의가 있습니다.');
        let result: any = querystringParser(url);
        const { video_id } = result;
        await MeetApi.deleteConferenceRoom(auth, video_id);

        return;
      } else {
        navigate('SplashView', { deeplink: url });
      }
    });

    return () => {};
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack.Navigator
        initialRouteName="SplashView"
        screenOptions={{ headerShown: false }}
      >
        <RootStack.Screen name="SplashView" component={SplashView} />
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
