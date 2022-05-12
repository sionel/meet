import 'react-native-gesture-handler';
import React, { RefObject, useEffect } from 'react';
import { Alert, AppState, AppStateStatus, Linking } from 'react-native';

import { NavigationContainer, NavigationState } from '@react-navigation/native';
import {
  createStackNavigator,
  StackScreenProps
} from '@react-navigation/stack';

// import SplashView from './SplashView';
import LoginStack from './LoginStack';
import MainStack from './MainStack';
import SettingView from '@screens/SettingScreen';
import ConferenceStateView from '@screens/ConferenceStateScreen';
// import ConferenceView from '@screens/ConferenceScreen';
import ConferenceRenewalView from '@screens/ConferenceScreen_New';
import SelectCompanyView from '@screens/SelectCompanyScreen';
import SplashView from '@screens/SplashScreen';

import { RootState } from '../redux/configureStore';
import { useDispatch, useSelector } from 'react-redux';
import { actionCreators as ConferenceActions } from '@redux/conference';
import { actionCreators as UserActions } from '@redux/user';
import { MeetApi } from '@services/index';
import { querystringParser } from '@utils/index';

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
  ConferenceView_new : {
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
    avatar: string;
  }
};

export type MeetNavigationProps<T extends keyof MeetParamList> =
  StackScreenProps<MeetParamList, T>;

const RootStack = createStackNavigator<MeetParamList>();

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

export default function RootNavigation(props: any) {
  // let nowStack = '';

  const dispatch = useDispatch();
  // const setIsConference = (flag: boolean) => {
  //   dispatch(ConferenceActions.setIsConference(flag));
  // };
  const setLoginType = (loginType: string) => {
    dispatch(UserActions.setLoginType(loginType));
  };

  const { auth } = useSelector((state: RootState) => {
    return {
      // isConference: state.conference.isConference,
      auth: state.user.auth
    };
  });

  // const checkConference = (state: Readonly<NavigationState> | undefined) => {
  //   const name = state?.routes[0].name;
  //   if (name === 'ConferenceView') nowStack = 'ConferenceView';
  //   else nowStack = '';
  // };

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
    // TODO: 회의 진행중에 다른 경로를 통해서 중복적으로 회의 접속에 대한 처리
    // 원래 conference 리덕스에서 회의진행중인지로 판단을 했으나 해당 리스트를 whiteList에 넣을시
    // 에러가 발생하여 whiteList에서 제거한 상태이기때문에 다른 리덕스를 통해서 처리가 필요함

    // if (isConference) {
    //   Alert.alert('허용되지 않은 접근', '앱이 재시작됩니다.');
    //   setIsConference(false);
    //   return;
    // }

    if (props.url?.url) navigate('SplashView', { deeplink: props.url.url });

    // 앱이 꺼져 있을때(딥링크)
    Linking.getInitialURL()
      .then(url => url && navigate('SplashView', { deeplink: url }))
      .catch(err => console.error('error ', err));

    // return () => {
    //   Linking.removeListener('url', _handleOpenURL);
    // };
    // 앱이 이미 실행중일때(딥링크)
    Linking.addEventListener('url', async ({ url }) => {
      let { name } = navigationRef.current.getCurrentRoute();
      console.log('앱이 이미 실행중일때(딥링크)');
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

    return () => {
      Linking.removeEventListener('url', async ({ url }) => {
        let { name } = navigationRef.current.getCurrentRoute();
        console.log('앱이 이미 실행중일때(딥링크)');
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
    };
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
        {/* <RootStack.Screen name="ConferenceView" component={ConferenceView} /> */}
        <RootStack.Screen name="SelectCompany" component={SelectCompanyView} />
        <RootStack.Screen name="ConferenceView_new" component={ConferenceRenewalView} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
