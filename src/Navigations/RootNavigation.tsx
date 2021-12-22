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

import { Alert, Linking } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/configureStore';

import { actionCreators as ConferenceActions } from '../redux/modules/conference';

// roomToken?: string;
export type MeetParamList = {
  SplashView: {
    deeplink?: string;
  };
  SelectCompany: undefined;
  LoginStack: undefined;
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

export default function RootNavigation(props: any) {
  let nowStack = '';
  const navigationRef: RefObject<any> = React.createRef();
  const dispatch = useDispatch();
  const setIsConference = (flag: boolean) => {
    dispatch(ConferenceActions.setIsConference(flag));
  };

  const navigate = (name: string, params: any) => {
    navigationRef.current?.navigate(name, params);
  };

  const { isConference } = useSelector((state: RootState) => {
    return {
      isConference: state.conference.isConference
    };
  });

  const checkConference = (state: Readonly<NavigationState> | undefined) => {
    const name = state?.routes[0].name;
    if (name === 'ConferenceView') nowStack = 'ConferenceView';
    else nowStack = '';
  };

  useEffect(()=> {
    if (isConference) {
      Alert.alert('허용되지 않은 접근', '앱이 재시작됩니다.');
      setIsConference(false);
    }

    if (props.url?.url) {
      navigate('SplashView', { deeplink: props.url.url });
    }
  }, []);

  //  ios : 앱이 켜져있을때(딥링크)
  Linking.addEventListener('url', event => {
    if (nowStack === 'ConferenceView') {
      Alert.alert('이미 진행중인 화상회의가 있습니다.');
      return;
    } else {
      navigate('SplashView', { deeplink: event.url });
    }
  });

  return (
    <NavigationContainer ref={navigationRef} onStateChange={checkConference}>
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
