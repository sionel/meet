import 'react-native-gesture-handler';
import * as React from 'react';
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
import { useDispatch } from 'react-redux';
import { actionCreators as ConferenceActions } from '../redux/modules/conference';

// roomToken?: string;
export type MeetParamList = {
  SplashView: undefined;
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

export default function RootNavigation() {
  const dispatch = useDispatch();
  const _setIsConference = (isConference: boolean) =>
    dispatch(ConferenceActions.setIsConference(isConference));

  const checkConference = (state: Readonly<NavigationState> | undefined) => {
    const name = state?.routes[0].name;
    if (name === 'ConferenceView') _setIsConference(true);
    else _setIsConference(false);
  };

  return (
    <NavigationContainer onStateChange={checkConference}>
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
