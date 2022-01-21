import React from 'react';
import {
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';

import CreateConference from '@screens/CreateScreen';
import DirectCreateConference from '@screens/CreateMeetScreen';
import ModifyConference from '@screens/ConferenceModifyScreen';
import InviteCode from '@screens/InviteCodeScreen';
import Home from '@screens/HomeScreen';
import ConfigurationStack from './ConfigurationStack';

import { MeetParamList } from './RootNavigation';

type MainStackParamList = MeetParamList & {
  Home: undefined;
  CreateConference: undefined;
  DirectCreateConference: undefined;
  ModifyConference: undefined;
  InviteCode:undefined;
  ConfigurationStack:undefined;
};

export type MainNavigationProps <T extends keyof MainStackParamList> =
StackScreenProps<MainStackParamList, T>;


const MainStacks = createStackNavigator<MainStackParamList>();

export default function MainStack() {
  // debugger
  return (
    <MainStacks.Navigator initialRouteName="Home" screenOptions={{headerShown: false}}>
      <MainStacks.Screen name="Home" component={Home} />
      <MainStacks.Screen name="CreateConference" component={CreateConference} />
      <MainStacks.Screen name="DirectCreateConference" component={DirectCreateConference} />
      <MainStacks.Screen name="ModifyConference" component={ModifyConference} />
      <MainStacks.Screen name="InviteCode" component={InviteCode} />
      <MainStacks.Screen name="ConfigurationStack" component={ConfigurationStack} />
    </MainStacks.Navigator>
  );
}
