import {
  StackNavigationProp,
  createStackNavigator
} from '@react-navigation/stack';
import InviteCode from '../Screens/LoginScreen';
import InputLogin from '../Screens/LoginScreen/LoginInputScreen';

type StackParamList = {
  InviteCode: undefined;
  InputLogin: undefined;
};

const Stack = createStackNavigator<StackParamList>();

export default function LoginNavigation_new() {
  return (
    <Stack.Navigator initialRouteName="InviteCode" screenOptions={{headerShown: false}}>
      <Stack.Screen name="InviteCode" component={InviteCode} />
      <Stack.Screen name="InputLogin" component={InputLogin} />
    </Stack.Navigator>
  );
}
