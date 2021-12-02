import React from 'react';
import {
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';
import Home from '../Screens/HomeScreen';
import CreateConference from '../Screens/CreateScreen';
import DirectCreateConference from '../Screens/CreateMeetScreen';
import ModifyConference from '../Screens/ConferenceModifyScreen';
import InviteCode from '../Screens/InviteCodeScreen';
import { MeetParamList } from './RootNavigation_new';

type MainStackParamList = MeetParamList & {
  Home: undefined;
  CreateConference: undefined;
  DirectCreateConference: undefined;
  ModifyConference: undefined;
  InviteCode:undefined;
};

export type MainNavigationProps <T extends keyof MainStackParamList> =
StackScreenProps<MainStackParamList, T>;


const Stack = createStackNavigator<MainStackParamList>();

export default function MainStack() {

  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="CreateConference" component={CreateConference} />
      <Stack.Screen name="DirectCreateConference" component={DirectCreateConference} />
      <Stack.Screen name="ModifyConference" component={ModifyConference} />
      <Stack.Screen name="InviteCode" component={InviteCode} />
    </Stack.Navigator>
  );
}
