import * as React from 'react';
import {
  StackNavigationProp,
  createStackNavigator
} from '@react-navigation/stack';
import Splash from '../Screens/SplashScreen';

// type StackParamList = {
//   Splash: undefined;
// };

const Stack = createStackNavigator();

export default function SplashNavigation_new() {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{headerShown: false}}>
      <Stack.Screen name="Splash" component={Splash} />
    </Stack.Navigator>
  );
}
