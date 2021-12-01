import 'react-native-gesture-handler';
import * as React from 'react';
import { Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SplashNavigation from './SplashNavigation_new';
import LoginNavigation from './LoginNavigation_new';
import MainNavigation from './MainNavigation_new';
import SettingNavigation from './SettingNavigation_new';
import ScreenStateNavigation from './ScreenStateNavigation_new';
import ConferenceNavigation from './ConferenceNavigation_new';

type StackParamList = {
  SplashNavigation: undefined;
  LoginNavigation: undefined;
  MainNavigation: undefined;
  SettingNavigation: undefined;
  ScreenStateNavigation: undefined;
  ConferenceNavigation: undefined;
};

const Stack = createStackNavigator<StackParamList>();

export default function RootNavigation_new(props: any) {
  console.log(props);
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashNavigation">
        <Stack.Screen name="SplashNavigation" component={SplashNavigation} options={{headerShown:false}} />
        <Stack.Screen name="LoginNavigation" component={LoginNavigation} options={{headerShown:false}} />
        <Stack.Screen name="MainNavigation" component={MainNavigation} options={{headerShown:false}} />
        <Stack.Screen name="SettingNavigation" component={SettingNavigation} options={{headerShown:false}} />
        <Stack.Screen name="ScreenStateNavigation" component={ScreenStateNavigation} options={{headerShown:false}} />
        <Stack.Screen name="ConferenceNavigation" component={ConferenceNavigation} options={{headerShown:false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
