import {
  StackNavigationProp,
  createStackNavigator
} from '@react-navigation/stack';
import ConferenceState from '../Screens/ConferenceStateScreen';


const Stack = createStackNavigator();

export default function ScreenStateNavigation_new() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ConferenceState" component={ConferenceState} />
    </Stack.Navigator>
  );
}
