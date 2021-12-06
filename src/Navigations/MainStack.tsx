import React from 'react';
import {
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';
// import Home from '../Screens/HomeScreen';
import CreateConference from '../Screens/CreateScreen';
import DirectCreateConference from '../Screens/CreateMeetScreen';
import ModifyConference from '../Screens/ConferenceModifyScreen';
import InviteCode from '../Screens/InviteCodeScreen';
import HomeStack from './HomeStack';
import { MeetParamList } from './RootNavigation_new';

import ConfigurationScreen from '../Screens/ConfigurationScreen';

type MainStackParamList = MeetParamList & {
  HomeStack: undefined;
  CreateConference: undefined;
  DirectCreateConference: undefined;
  ModifyConference: undefined;
  InviteCode:undefined;
  Configuration:undefined;
};

export type MainNavigationProps <T extends keyof MainStackParamList> =
StackScreenProps<MainStackParamList, T>;


const Stack = createStackNavigator<MainStackParamList>();

export default function MainStack() {

  return (
    <Stack.Navigator initialRouteName="HomeStack" screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeStack" component={HomeStack} />
      <Stack.Screen name="CreateConference" component={CreateConference} />
      <Stack.Screen name="DirectCreateConference" component={DirectCreateConference} />
      <Stack.Screen name="ModifyConference" component={ModifyConference} />
      <Stack.Screen name="InviteCode" component={InviteCode} />
      <Stack.Screen name="Configuration" component={ConfigurationScreen} />
    </Stack.Navigator>
  );
}
