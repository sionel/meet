import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Splash from '../Screens/SplashScreen';

const Stack = createStackNavigator();

export default function SplashView() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash" component={Splash} />
    </Stack.Navigator>
  );
}
