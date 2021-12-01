import {
  StackNavigationProp,
  createStackNavigator
} from '@react-navigation/stack';
import Main from '../Screens/MainScreen';
import CreateConference from '../Screens/CreateScreen';
import DirectCreateConference from '../Screens/CreateMeetScreen';
import ModifyConference from '../Screens/ConferenceModifyScreen';
import InviteCode from '../Screens/InviteCodeScreen';

type StackParamList = {
  Main: undefined;
  CreateConference: undefined;
  DirectCreateConference: undefined;
  ModifyConference: undefined;
  InviteCode: undefined;
};


const Stack = createStackNavigator<StackParamList>();

export default function MainNavigation_new() {

  return (
    <Stack.Navigator initialRouteName="Main" screenOptions={{headerShown: false}}>
      <Stack.Screen name="Main" component={Main} />
      <Stack.Screen name="CreateConference" component={CreateConference} />
      <Stack.Screen name="DirectCreateConference" component={DirectCreateConference} />
      <Stack.Screen name="ModifyConference" component={ModifyConference} />
      <Stack.Screen name="InviteCode" component={InviteCode} />
    </Stack.Navigator>
  );
}
