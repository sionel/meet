import {
  StackNavigationProp,
  createStackNavigator
} from '@react-navigation/stack';
import Setting from '../Screens/SettingScreen';

const Stack = createStackNavigator();

export default function SettingNavigation_new() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Setting" component={Setting} />
    </Stack.Navigator>
  );
}
