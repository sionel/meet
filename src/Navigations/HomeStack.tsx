import React from 'react';
import {
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';
import Home from '../Screens/HomeScreen';
import InputLogin from '../Screens/ConfigurationScreen';

// type LoginStackParamList =  {
//   InviteCode: undefined;
//   InputLogin: undefined;
// };

// export type LoginNavigationProps <T extends keyof LoginStackParamList> =
// StackScreenProps<LoginStackParamList, T>;

const Stack = createStackNavigator();

export default function HomeStack() {
  
  return (
    <Stack.Navigator  initialRouteName="Home" screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
}
