import React from 'react';
import {
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';
import InviteCode from '../Screens/LoginScreen';
import InputLogin from '../Screens/LoginScreen/LoginInputScreen';
import { MeetParamList } from './RootNavigation';

type LoginStackParamList = MeetParamList & {
  InviteCode: undefined;
  InputLogin: undefined;
};

export type LoginNavigationProps <T extends keyof LoginStackParamList> =
StackScreenProps<LoginStackParamList, T>;

const LoginStacks = createStackNavigator<LoginStackParamList>();

export default function LoginStack() {
  
  return (
    <LoginStacks.Navigator  initialRouteName="InviteCode" screenOptions={{headerShown: false}}>
      <LoginStacks.Screen name="InviteCode" component={InviteCode} />
      <LoginStacks.Screen name="InputLogin" component={InputLogin} />
    </LoginStacks.Navigator>
  );
}
