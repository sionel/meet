import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  StackScreenProps
} from '@react-navigation/stack';

import SplashView from './SplashView';
import LoginStack from './LoginStack';
import MainStack from './MainStack';
import SettingView from '../Screens/SettingScreen';
import ConferenceStateView from '../Screens/ConferenceStateScreen';
import ConferenceView from '../Screens/ConferenceScreen';

export type MeetParamList = {
  SplashView: undefined;
  LoginStack: undefined;
  MainStack: undefined;
  SettingView: {
    accessType?: 'auth' | 'email' | 'joincode';
    callType?: number;
    id?: string;
    isCreator?: any;
    joincode?: string;
    roomType?: string;
    selectedRoomName?: string;
    token?: null | string;
  };
  ConferenceStateView: {
    accessType?: 'auth' | 'email' | 'joincode';
    externalData?: string | null;
    from?: string;
    id: string;
    joincode?: string;
  };
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
    tracks: any;
  };
};

export type MeetNavigationProps<T extends keyof MeetParamList> =
  StackScreenProps<MeetParamList, T>;

const Stack = createStackNavigator();

export default function RootNavigation_new() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SplashView"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="SplashView" component={SplashView} />
        <Stack.Screen name="LoginStack" component={LoginStack} />
        <Stack.Screen name="MainStack" component={MainStack} />
        <Stack.Screen
          name="ConferenceStateView"
          component={ConferenceStateView}
        />
        <Stack.Screen name="SettingView" component={SettingView} />
        <Stack.Screen name="ConferenceView" component={ConferenceView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
