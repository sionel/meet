import React from 'react';
import {
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';

import Configuration from '@screens/ConfigurationScreen';
import Awards from '@screens/ConfigurationScreen/subScreens/AwardsScreen';
import OpenSource from '@screens/ConfigurationScreen/subScreens/OpenSourceScreen';
import Policy from '@screens/ConfigurationScreen/subScreens/PolicyScreen';
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
