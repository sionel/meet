import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
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

import SelectCompanyScreen from '../Screens/SelectCompanyScreen';

import SplashView from '../Screens/SplashScreen';

// roomToken?: string;
export type MeetParamList = {
  SplashView: undefined;
  SelectCompany: undefined;
  LoginStack: undefined;
  MainStack: undefined;
  ConferenceStateView:
    | {
        accessType: 'auth' | 'email';
        from?: string;
        id: string;
      }
    | {
        accessType: 'joincode';
        joincode?: string;
      };

  SettingView:
    | {
        accessType: 'auth' | 'email';
        id: string;
        roomType?: string;
        selectedRoomName?: string;
      }
    | { accessType: 'joincode'; joincode: string };

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

const RootStack = createStackNavigator();

export default function RootNavigation() {
  return (
    <NavigationContainer>
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
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
