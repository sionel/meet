import React from 'react';
import {
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';
import InviteCode from '../Screens/LoginScreen';
import InputLogin from '../Screens/LoginScreen/LoginInputScreen';
import { MeetParamList } from './RootNavigation_new';

type LoginStackParamList = MeetParamList & {
  InviteCode: undefined;
  InputLogin: undefined;
};

export type LoginNavigationProps <T extends keyof LoginStackParamList> =
StackScreenProps<LoginStackParamList, T>;

const Stack = createStackNavigator<LoginStackParamList>();

export default function LoginStack() {
  
  return (
    <Stack.Navigator  initialRouteName="InviteCode" screenOptions={{headerShown: false}}>
      <Stack.Screen name="InviteCode" component={InviteCode} />
      <Stack.Screen name="InputLogin" component={InputLogin} />
    </Stack.Navigator>
  );
}
