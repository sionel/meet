import React from 'react';
import {
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';

import Configuration from '../Screens/ConfigurationScreen';
import Awards from '../Screens/ConfigurationScreen/subScreens/AwardsScreen';
import OpenSource from '../Screens/ConfigurationScreen/subScreens/OpenSourceScreen';
import Policy from '../Screens/ConfigurationScreen/subScreens/PolicyScreen';
import { MeetParamList } from './RootNavigation';

type ConfigurationStackParamList = MeetParamList & {
  Configuration: undefined;
  Awards: undefined;
  OpenSource: undefined;
  Policy: undefined;
};

export type ConfigurationNavigationProps <T extends keyof ConfigurationStackParamList> =
StackScreenProps<ConfigurationStackParamList, T>;

const ConfigStack = createStackNavigator<ConfigurationStackParamList>();

export default function ConfigurationStack() {
  
  return (
    <ConfigStack.Navigator  initialRouteName="Configuration" screenOptions={{headerShown: false}}>
      <ConfigStack.Screen name="Configuration" component={Configuration} />
      <ConfigStack.Screen name="Awards" component={Awards} />
      <ConfigStack.Screen name="OpenSource" component={OpenSource} />
      <ConfigStack.Screen name="Policy" component={Policy} />
      {/* <ConfigStack.Screen name="Configuration" component={Configuration} /> */}    
    </ConfigStack.Navigator>
  );
}
