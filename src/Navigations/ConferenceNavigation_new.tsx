import {
  StackNavigationProp,
  createStackNavigator
} from '@react-navigation/stack';
import Conference from '../Screens/ConferenceScreen';

const Stack = createStackNavigator();

export default function ConferenceNavigation_new() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Conference" component={Conference} />
    </Stack.Navigator>
  );
}
