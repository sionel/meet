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
    roomType?: string;
    videoRoomId?: string;
    callType?: number;
    isCreator?: any;
    selectedRoomName?: string;
    params?: any;
    accessType?: 'auth' | 'email' | 'joincode';
    roomId?: string;
    token?: null | string;
  };
  ConferenceStateView: {
    id: string;
    externalData?: string | null;
    from?: string;
    accessType?: 'auth' | 'email' | 'joincode';
    joincode?: string;
  };
  ConferenceView: {
    tracks: [];
    roomToken: string;
    name: string;
    params: any;
    accesstype: string;
    externalUser: any;
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
